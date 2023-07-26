# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import re
from pathlib import Path

import sphinx_radiac_theme  # noqa


# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
def find_version(*paths):
    path = Path(*paths)
    content = path.read_text()
    match = re.search(r"^__version__\s*=\s*['\"]([^'\"]*)['\"]", content, re.M)
    if match:
        return match.group(1)
    raise RuntimeError("Unable to find version string.")


project = "django-fancy-formset"
copyright = "2023, Richard Terry"
author = "Richard Terry"
release = find_version("..", "fancy_formset", "__init__.py")

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx_radiac_theme",
    "sphinx_js",
    # "sphinx_gitref",
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "venv", "README.rst"]

# sphinx-js
js_source_path = "../src"
# primary_domain = "js"


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_radiac_theme"
html_static_path = ["_static"]

html_theme_options = {
    "analytics_id": "G-NH3KEN9NBN",
    "logo_only": False,
    "display_version": True,
    # Toc options
    "collapse_navigation": True,
    "sticky_navigation": True,
    "navigation_depth": 4,
    "includehidden": True,
    "titles_only": False,
    # radiac.net theme
    "radiac_project_slug": "django-fancy-formset",
    "radiac_project_name": "django-fancy-formset",
}
