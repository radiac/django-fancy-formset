import re
from pathlib import Path

from django.urls import reverse

import pytest
from model_bakery import baker
from project.library.models import Author, Book
from pytest_django.asserts import assertHTMLEqual, test_case


pytestmark = pytest.mark.django_db
test_case.maxDiff = None


def fix_html(raw):
    fixed = re.sub(
        r'<input[^>]+?name="csrfmiddlewaretoken"[^>]+>',
        '<input name="csrfmiddlewaretoken">',
        raw,
    )
    return fixed


def mk_test_data():
    author = baker.make(Author, name="Ernest Djangoway")
    baker.make(
        Book, author=author, title="For Whom the Form Tolls", year_published=1940
    )
    baker.make(
        Book, author=author, title="The Old Man and the Formset", year_published=1952
    )
    return author


def test_add_formset__matches_expected(client):
    response = client.get(reverse("library:author_form"))
    expected = fix_html(Path("tests/01-add.html").read_text())
    actual = fix_html(response.content.decode("utf8"))
    assertHTMLEqual(expected, actual)


def test_edit_formset__matches_expected(client):
    author = mk_test_data()
    response = client.get(
        reverse("library:author_form", kwargs={"author_id": author.id})
    )
    expected = fix_html(Path("tests/02-edit.html").read_text())
    actual = fix_html(response.content.decode("utf8"))
    assertHTMLEqual(expected, actual)
