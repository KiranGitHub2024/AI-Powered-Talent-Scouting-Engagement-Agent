import random


def simulate_conversation(jd, resume, match_score):
    conversation = []

    # -----------------------------
    # Q1: Interest in role
    # -----------------------------
    if match_score > 70:
        interest_reply = random.choice([
            "Yes, this role aligns well with my experience.",
            "I am definitely interested in this opportunity."
        ])
        interest_score = 80

    elif match_score > 40:
        interest_reply = random.choice([
            "I might be interested depending on the role details.",
            "I am open to exploring this opportunity."
        ])
        interest_score = 60

    else:
        interest_reply = random.choice([
            "I am not very interested at the moment.",
            "This role does not fully match my expectations."
        ])
        interest_score = 30

    conversation.append({
        "agent": "Are you interested in this job opportunity?",
        "candidate": interest_reply
    })

    # -----------------------------
    # Q2: Experience confidence
    # -----------------------------
    if resume.get("experience"):
        conversation.append({
            "agent": "Do you feel your experience matches this role?",
            "candidate": f"I have {resume['experience']} of relevant experience."
        })

    # -----------------------------
    # Q3: Salary / availability (simple simulation)
    # -----------------------------
    availability_reply = random.choice([
        "I am available to join within 30 days.",
        "I would need a short notice period before joining."
    ])

    conversation.append({
        "agent": "What is your availability?",
        "candidate": availability_reply
    })

    # -----------------------------
    # FINAL INTEREST SCORE
    # -----------------------------
    # Add slight randomness for realism
    interest_score += random.randint(-5, 5)

    interest_score = max(0, min(100, interest_score))

    return {
        "interest_score": interest_score,
        "conversation": conversation
    }