==========================
Building the documentation
==========================

This uses `sphinx-js <https://pypi.org/project/sphinx-js/>`_, which uses `jsdoc
<https://jsdoc.app/>`_::

    npm install  -g jsdoc


Then from within this directory::

    python -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt
    sphinx-build . _build


To autobuild while working on the docs::

    pip install sphinx-autobuild
    sphinx-autobuild --port=8001 . _build/html
