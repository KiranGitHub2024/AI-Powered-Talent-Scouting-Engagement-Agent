# Input handler for JD parsing
def extract_text(raw_text=None):
    """
    Basic input handler for now.
    Accepts direct text input.
    """

    if not raw_text:
        raise ValueError("No input text provided")

    return raw_text.strip()