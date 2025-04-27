# workguardai-excavation-demo
import cv2
import numpy as np

# --- Settings ---
video_path = "IMG_7066.MOV"  # Your original video
output_path = "excavation_progress_demo.mp4"
total_books = 5

# --- Manual frame points where books are removed ---
# Example: at frame 30, 60, 90... (You can adjust after seeing the video)
book_removal_frames = [30, 90, 150, 210, 270]  # Example frame numbers

# --- Initialize ---
cap = cv2.VideoCapture(video_path)
fps = int(cap.get(cv2.CAP_PROP_FPS))
width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

current_book_removed = 0

frame_num = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Check if a book was removed
    if frame_num in book_removal_frames:
        current_book_removed += 1

    # Calculate excavation progress
    progress = (current_book_removed / total_books) * 100

    # --- Draw overlays ---
    # Excavation Area Rectangle
    cv2.rectangle(frame, (100, 100), (width-100, height-100), (255, 0, 0), 4)

    # Quota marker
    cv2.putText(frame, "Quota: Target Depth", (120, height-120),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 3)

    # Progress % Text
    cv2.putText(frame, f"{int(progress)}% Complete", (120, 150),
                cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4)

    # Progress Bar
    bar_length = int((width-200) * (progress / 100))
    cv2.rectangle(frame, (100, 70), (100 + bar_length, 90), (0, 255, 0), -1)

    out.write(frame)
    frame_num += 1

cap.release()
out.release()
print("✅ Video created:", output_path)
