import { JSDOM } from 'jsdom';
//import { init as init_formsets } from '../src/formset';
import { init as init_formsets } from '../dist/formset.module';


/**
 * Helpers
 */
function init_formset(options) {
  // Simplify tests that only use one formset
  let formsets = init_formsets(options);
  expect(formsets.length).toBe(1);
  return formsets[0];
}
function assertFormCount(expected, formset) {
  expect(
    document.querySelectorAll('[id^="id_book_set-"]:not([id*="__prefix__"])[id$="-DELETE"]'
  ).length).toBe(expected);
}
function assertDelete(id, checked) {
  expect(document.querySelector(`#id_book_set-${id}-DELETE`)).not.toBeNull();
  expect(document.querySelector(`#id_book_set-${id}-DELETE`).checked).toBe(checked);
}
function click(selector, count=1) {
  let btn = document.querySelector(selector);
  expect(btn).not.toBeNull();
  for (let i=0; i<count; i++) {
    btn.dispatchEvent(new window.MouseEvent('click'));
  }
}
function clickDelete(id) {
  click(`label[for="id_book_set-${id}-DELETE"]`);
}

/**
 * Test an add form, where there is no existing data
 */

describe('Add form', () => {
  beforeEach(async () => {
    global.dom = await JSDOM.fromFile("./tests/01-add.html");
    global.window = dom.window;
    global.document = dom.window.document;

    // Make jsdom elements available to formset
    global.HTMLElement = dom.window.HTMLElement;
    global.NodeList = dom.window.NodeList;
    global.CustomEvent = dom.window.CustomEvent;

  });

  afterEach(() => {
    dom.window.close();
  });


  it('plain page contains expected formsets', () => {
    assertFormCount(3);
    assertDelete('__prefix__', false);
    assertDelete(0, false);
    assertDelete(1, false);
    assertDelete(2, false);
  });

  it('script should remove extra forms', () => {
    let formset = init_formset();
    assertFormCount(0);
    expect(formset.numForms).toBe(0);
    assertDelete('__prefix__', false);
    expect(formset._nextId).toBe(0);
  });

  it('script starts with expected state', () => {
    let formset = init_formset();
    let formsetClasses = document.querySelector('div[data-formset]').classList

    expect(formsetClasses).toContain('formset-active');
    expect(formsetClasses).toContain('formset-at-min');
    expect(formsetClasses).not.toContain('formset-at-max');
  });

  it('add button adds a formset', () => {
    let formset = init_formset();
    expect(formset._nextId).toBe(0);
    click('.formset-add');
    assertFormCount(1);
    assertDelete(0, false);
    expect(document.querySelector('#id_book_set-1-DELETE')).toBeNull();
    expect(formset._nextId).toBe(1);
    expect(document.querySelector('div[data-formset]').classList).not.toContain('formset-at-min');
  });

  it('add button three times adds three formsets', () => {
    let formset = init_formset();
    click('.formset-add', 3);
    assertFormCount(3);
    expect(formset.numForms).toBe(3);
    assertDelete(0, false);
    assertDelete(1, false);
    assertDelete(2, false);
  });

  it('first delete button leaves first formset in place', () => {
    let formset = init_formset();
    click('.formset-add', 3);
    assertDelete(0, false);
    assertDelete(1, false);
    assertDelete(2, false);

    clickDelete(0);
    assertFormCount(3);
    expect(formset.numForms).toBe(2);
    assertDelete(0, true);
    assertDelete(1, false);
    assertDelete(2, false);
    expect(formset._nextId).toBe(3);
  });

  it('adds three, deletes one, adds one', () => {
    let formset = init_formset();
    click('.formset-add', 3);
    clickDelete(0);
    click('.formset-add');

    assertFormCount(4);
    expect(formset.numForms).toBe(3);
    assertDelete(0, true);
    assertDelete(1, false);
    assertDelete(2, false);
    assertDelete(3, false);
  });

  it('minimum 1 doesnt remove all at start', () => {
    let minEl = document.getElementById('id_book_set-MIN_NUM_FORMS');
    expect(minEl).not.toBeNull();
    minEl.value = 1;
    let formset = init_formset();
    expect(formset.numFormsMin).toBe(1);
    expect(formset.atMin).toBe(true);
    expect(formset.atMax).toBe(false);
    expect(document.querySelector('div[data-formset]').classList).toContain('formset-at-min');
    assertFormCount(1);
    expect(formset.numForms).toBe(1);
  });

  it('minimum 1 forbids delete button', () => {
    let minEl = document.getElementById('id_book_set-MIN_NUM_FORMS');
    expect(minEl).not.toBeNull();
    minEl.value = 1;

    let formset = init_formset();
    clickDelete(0);
    assertFormCount(1);
    expect(formset.numForms).toBe(1);
  });

  it('minimum 1 with allowDeleteAtMin allows delete button', () => {
    let minEl = document.getElementById('id_book_set-MIN_NUM_FORMS');
    expect(minEl).not.toBeNull();
    minEl.value = 1;

    let formset = init_formset({allowDeleteAtMin: true});
    expect(formset.atMin).toBe(true);
    clickDelete(0);

    assertFormCount(1);
    expect(formset.numForms).toBe(0);
    expect(formset.atMin).toBe(true);
  });

  it('maximum 3 forbids add button at 3', () => {
    let maxEl = document.getElementById('id_book_set-MAX_NUM_FORMS');
    expect(maxEl).not.toBeNull();
    maxEl.value = 3;

    let formset = init_formset();
    expect(formset.numFormsMax).toBe(3);
    click('.formset-add', 3);
    assertFormCount(3);
    expect(formset.numForms).toBe(3);

    expect(formset.atMin).toBe(false);
    expect(formset.atMax).toBe(true);
    expect(document.querySelector('div[data-formset]').classList).toContain('formset-at-max');
    click('.formset-add');
    assertFormCount(3);
    expect(formset.numForms).toBe(3);
  });

  it('maximum 3 with allowAddAtMax allows add button at 3', () => {
    let maxEl = document.getElementById('id_book_set-MAX_NUM_FORMS');
    expect(maxEl).not.toBeNull();
    maxEl.value = 3;

    let formset = init_formset({allowAddAtMax: true});
    expect(formset.numFormsMax).toBe(3);
    click('.formset-add', 3);
    assertFormCount(3);
    expect(formset.numForms).toBe(3);

    expect(formset.atMin).toBe(false);
    expect(formset.atMax).toBe(true);
    click('.formset-add');
    assertFormCount(4);
    expect(formset.numForms).toBe(4);
    expect(formset.atMin).toBe(false);
    expect(formset.atMax).toBe(true);
  });

});


/**
 * Test an edit form, where there is existing data
 *
 * Test form has 2 entries, 3 empties
 */

describe('Edit form', () => {
  beforeEach(async () => {
    global.dom = await JSDOM.fromFile("./tests/02-edit.html");
    global.window = dom.window;
    global.document = dom.window.document;

    // Make jsdom elements available to formset
    global.HTMLElement = dom.window.HTMLElement;
    global.NodeList = dom.window.NodeList;
    global.CustomEvent = dom.window.CustomEvent;

  });

  afterEach(() => {
    dom.window.close();
  });


  it('plain page contains expected formsets', () => {
    assertFormCount(5);
    assertDelete('__prefix__', false);
    assertDelete(0, false);
    assertDelete(1, false);
    assertDelete(2, false);
    assertDelete(3, false);
    assertDelete(4, false);
  });

  it('script should remove extra forms', () => {
    let formset = init_formset();
    assertFormCount(2);
    expect(formset.numForms).toBe(2);
    assertDelete('__prefix__', false);
    assertDelete(0, false);
    assertDelete(1, false);
    expect(formset._nextId).toBe(2);
  });

  it('script starts with expected state', () => {
    let formset = init_formset();
    let formsetClasses = document.querySelector('div[data-formset]').classList

    expect(formsetClasses).toContain('formset-active');
    expect(formsetClasses).not.toContain('formset-at-min');
    expect(formsetClasses).not.toContain('formset-at-max');
  });

  it('add button adds a formset', () => {
    let formset = init_formset();
    expect(formset._nextId).toBe(2);
    click('.formset-add');
    assertFormCount(3);
    assertDelete(0, false);
    assertDelete(1, false);
    assertDelete(2, false);
    expect(formset._nextId).toBe(3);
  });

  it('first delete button leaves first formset in place', () => {
    let formset = init_formset();
    assertDelete(0, false);
    assertDelete(1, false);

    clickDelete(0);
    assertFormCount(2);
    expect(formset.numForms).toBe(1);
    assertDelete(0, true);
    assertDelete(1, false);
    expect(formset._nextId).toBe(2);
  });

  it('adds one, deletes two, adds one', () => {
    let formset = init_formset();
    click('.formset-add');
    clickDelete(1);
    clickDelete(2);
    click('.formset-add');

    assertFormCount(4);
    expect(formset.numForms).toBe(2);
    assertDelete(0, false);
    assertDelete(1, true);
    assertDelete(2, true);
    assertDelete(3, false);
  });
});
