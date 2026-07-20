"""Content Studio: turns a raw photo + copy into a ready-to-post square graphic."""

from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageDraw, ImageFont, ImageOps

CANVAS_SIZE = (1080, 1080)
OVERLAY_HEIGHT_RATIO = 0.32
BRAND_COLOR = (212, 175, 55)  # gold accent


def _font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        # Older Pillow without the `size` kwarg on load_default.
        return ImageFont.load_default()


def _wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    current = ''
    for word in words:
        candidate = f'{current} {word}'.strip()
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def generate_poster_image(poster):
    """Renders `poster.base_image` + text fields into `poster.generated_image`."""
    base = Image.open(poster.base_image).convert('RGB')
    canvas = ImageOps.fit(base, CANVAS_SIZE, method=Image.LANCZOS)

    overlay_height = int(CANVAS_SIZE[1] * OVERLAY_HEIGHT_RATIO)
    gradient = Image.new('L', (1, overlay_height), color=0)
    for y in range(overlay_height):
        gradient.putpixel((0, y), int(255 * (y / overlay_height)))
    gradient = gradient.resize((CANVAS_SIZE[0], overlay_height))
    shadow = Image.new('RGBA', (CANVAS_SIZE[0], overlay_height), (0, 0, 0, 255))
    shadow.putalpha(gradient)

    canvas = canvas.convert('RGBA')
    canvas.paste(shadow, (0, CANVAS_SIZE[1] - overlay_height), shadow)

    draw = ImageDraw.Draw(canvas)
    padding = 48
    text_width = CANVAS_SIZE[0] - (padding * 2)

    headline_font = _font(64)
    subtext_font = _font(34)

    headline_lines = _wrap_text(draw, poster.headline_text.upper(), headline_font, text_width)
    subtext_lines = _wrap_text(draw, poster.subtext, subtext_font, text_width) if poster.subtext else []

    y = CANVAS_SIZE[1] - padding - (len(subtext_lines) * 44) - (len(headline_lines) * 74)
    for line in headline_lines:
        draw.text((padding, y), line, font=headline_font, fill=BRAND_COLOR)
        y += 74

    y += 10
    for line in subtext_lines:
        draw.text((padding, y), line, font=subtext_font, fill=(255, 255, 255))
        y += 44

    buffer = BytesIO()
    canvas.convert('RGB').save(buffer, format='JPEG', quality=90)
    filename = f'poster_{poster.pk}.jpg'
    poster.generated_image.save(filename, ContentFile(buffer.getvalue()), save=False)
    poster.save(update_fields=['generated_image'])
    return poster
