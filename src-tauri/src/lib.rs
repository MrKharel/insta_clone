use image::{imageops::FilterType, load_from_memory, RgbaImage};
use tauri::ipc::{InvokeBody, Request, Response};
use webp::Encoder;

const MIN_QUALITY: u32 = 10;
const MAX_QUALITY: u32 = 90;
const MAX_RESIZE_PASSES: u32 = 6;
const RESIZE_FACTOR: f32 = 0.8;

fn encode(img: &RgbaImage, quality: u32) -> Vec<u8> {
    Encoder::from_rgba(img.as_raw(), img.width(), img.height())
        .encode(quality as f32)
        .to_vec()
}

/// Finds the highest quality whose output fits in `max_bytes`.
fn encode_under_limit(img: &RgbaImage, max_bytes: usize) -> Option<Vec<u8>> {
    // Best case: highest quality already fits.
    let best = encode(img, MAX_QUALITY);
    if best.len() <= max_bytes {
        return Some(best);
    }

    // Worst case: even the lowest quality doesn't fit.
    let worst = encode(img, MIN_QUALITY);
    if worst.len() > max_bytes {
        return None;
    }

    // Invariant: `lo` fits, `hi` doesn't.
    let (mut lo, mut hi) = (MIN_QUALITY, MAX_QUALITY);
    let mut result = worst;
    while hi - lo > 1 {
        let mid = (lo + hi) / 2;
        let out = encode(img, mid);
        if out.len() <= max_bytes {
            lo = mid;
            result = out;
        } else {
            hi = mid;
        }
    }
    Some(result)
}

fn compress(input: &[u8], max_bytes: usize) -> Result<Vec<u8>, String> {
    let mut img = load_from_memory(input)
        .map_err(|e| format!("Failed to decode image: {e}"))?
        .to_rgba8();

    for _ in 0..MAX_RESIZE_PASSES {
        if let Some(out) = encode_under_limit(&img, max_bytes) {
            return Ok(out);
        }

        // Still too big at minimum quality: shrink the image and retry.
        let w = ((img.width() as f32 * RESIZE_FACTOR) as u32).max(1);
        let h = ((img.height() as f32 * RESIZE_FACTOR) as u32).max(1);
        if w == img.width() && h == img.height() {
            break;
        }
        img = image::imageops::resize(&img, w, h, FilterType::Lanczos3);
    }

    Err("Unable to compress image below size limit".into())
}

/// Raw bytes in the request body, size limit in the `x-max-size-kb` header.
#[tauri::command]
async fn convert_to_webp(request: Request<'_>) -> Result<Response, String> {
    let InvokeBody::Raw(input) = request.body() else {
        return Err("Expected raw binary body".into());
    };
    let input = input.clone();

    let max_size_kb: usize = request
        .headers()
        .get("x-max-size-kb")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.parse().ok())
        .ok_or("Missing or invalid x-max-size-kb header")?;

    let output = tauri::async_runtime::spawn_blocking(move || {
        compress(&input, max_size_kb * 1024)
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(Response::new(output))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_to_webp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
