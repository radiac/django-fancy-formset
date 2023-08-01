=========
Changelog
=========

1.0.0, 2023-08-01
=================

* Additional testing and documentation
* Promote v0.2 to v1 stable release


0.2.2, 2023-07-27
=================

(Also 0.2.1, 2023-07-26)

Packaging and documentation updates.


0.2.0, 2023-07-25
=================

Initial release under the name ``django-fancy-formset``.

Changes:

* Split out from ``django-fastview`` package so it can be installed independently and
  used as a script or module. See installation documentation for details.

* Added support for configuration via ``options``. See configuration documentation for
  details.

* Form events and the functions that raise them have been renamed and restructured. See
  the events documentation for details.

* Internal API updated and formalised for extensibility. See the documentation on
  extending for details.

* Added Python package with default templates.

* Improved support for more formset layouts and HTML variations; improved CSS; addressed
  outstanding bugs.


0.1.0, 2022-08-15
=================

Changes:

* Improved support for templates
* Improved styling
* Remove unused ``extra`` forms on initialisation
* Added events


0.0.3, 2020-02-10
=================

Initial release (as part of ``django-fastview``)

