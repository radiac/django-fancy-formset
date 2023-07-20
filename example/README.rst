=====================================
django-fancy-formset example project
=====================================

This example project has one app, ``library`` which manages a list of authors and their
books.


This uses the built resources in ``dist``, so in the top level ensure you have run::

    npm run build


Then from within this directory::

    python -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt
    ./manage.py migrate
    ./manage.py runserver 0:8000
