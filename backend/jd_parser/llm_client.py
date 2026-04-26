from transformers import pipeline

# 🔹 Load model
generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

# 🔹 Prevent token overflow
def truncate_text(text, max_chars=1000):
    return text[:max_chars]


def call_llm(prompt):
    try:
        safe_prompt = truncate_text(prompt)

        result = generator(
            safe_prompt,
            max_new_tokens=256,
            do_sample=False
        )

        output = result[0]["generated_text"]
        print("Raw Response:", output)

        return output

    except Exception as e:
        print("LLM ERROR:", str(e))
        return ""