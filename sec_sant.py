import random

def secret_santa(names):
    recipients = names.copy()

    while True:
        random.shuffle(recipients)
        if all(giver != receiver for giver, receiver in zip(names , recipients)):
            break

    assignments = {giver: receiver for giver, receiver in zip(names, recipients)}

    return assignments


names = [
    "Auntie Kristina",
    "Auntie Salina",
    "Auntie Julie",
    "Matt",
    "Venessa",
    "Mia",
    "Vince",
    "Alyssa",
    "Alianna",
    "Kristyanna",
    "Gio",
    "Alicia",
    "Auntie Mel",
    "Jesilyn",
    "Dylan"
]

assignments = secret_santa(names)

for giver, receiver in assignments.items():
    print(f"{giver}: {receiver},")