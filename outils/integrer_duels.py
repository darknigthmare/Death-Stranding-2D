"""Ajouter Échos de la Grève à l'écran titre de La Ligne silencieuse."""

import argparse
from pathlib import Path


IMPORT_BUTTON = b'<button id="title-import">'
OLD_DUEL_BUTTON = (
    '<button id="title-duels" type="button" '
    '''onclick="location.assign('./duels/jeu/index.html?depuis=campagne')">'''
    'Les Duels de la Grève <span aria-hidden="true">→</span></button>'
).encode("utf-8")

DUEL_BUTTON = (
    '<button id="title-echos" type="button" '
    """onclick="location.assign('./modes/echos-de-la-greve/index.html')">"""
    'Échos de la Grève <span aria-hidden="true">→</span></button>'
).encode("utf-8")


def integrate(source, output):
    if source.resolve() == output.resolve():
        raise ValueError("Choisissez un fichier de sortie distinct de l’export d’origine.")
    content = source.read_bytes()
    if DUEL_BUTTON in content:
        result = content
    elif content.count(OLD_DUEL_BUTTON) == 1:
        result = content.replace(OLD_DUEL_BUTTON, DUEL_BUTTON)
    elif content.count(IMPORT_BUTTON) == 1:
        result = content.replace(IMPORT_BUTTON, DUEL_BUTTON + IMPORT_BUTTON)
    else:
        raise ValueError("L’entrée d’import du menu titre est absente ou ambiguë.")
    if output.exists() and output.read_bytes() != result:
        raise ValueError(f"{output} existe déjà avec un contenu différent.")
    output.write_bytes(result)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export", type=Path, help="export HTML de la campagne v0.58")
    parser.add_argument("--sortie", type=Path, default=Path("JOUER.html"))
    args = parser.parse_args()
    try:
        integrate(args.export, args.sortie)
    except (ValueError, OSError) as error:
        parser.exit(1, f"{error}\n")
    print(f"Menu de campagne prêt dans {args.sortie}.")
