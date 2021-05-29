'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const Template = require('../src/Template')
const Globals = require('../src/View/globals')
const { Helpers, Config } = require('@adonisjs/sink')

let view
let template

describe('Template class', () => {
  beforeEach(() => {
    view = new View(new Helpers(path.join(__dirname, './')), new Config())

    Globals(view, {}, new Config())

    template = view.new()
  })

  it('Globals are bound to the template context', () => {
    const myFunc = function () {
      expect(this.engine.name).to.equal('Liquid')
      return true
    }

    template = new Template(view.engine, '', {}, { myString: 'string', myFunc })

    expect(template.globals).to.be.an('object')
    expect(template.globals.myFunc).to.be.a('function')
    expect(template.globals.myFunc()).to.equal(true)
  })

  it('Share method adds to locals', () => {
    template = new Template(view.engine, '', {}, {})
    template.share({myKey: 'some-string'})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myKey).to.equal('some-string')
  })

  it('Share method adds to local and applies context to functions', () => {
    const myFunc = function () {
      expect(this.engine.name).to.equal('Liquid')
      return true
    }

    template = new Template(view.engine, '', {}, {})

    template.share({'myFunc': myFunc})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myFunc).to.be.a('function')
    expect(template.locals.myFunc()).to.equal(true)
  })

  it('Resolve method fetches a local, option or global', () => {
    const myFunc = function () {
      expect(this.engine.name).to.equal('Liquid')
      return true
    }

    template = new Template(view.engine, '', {}, {})

    template.share({'myFunc': myFunc})

    expect(template.resolve('myFunc')).to.be.a('function')
    expect(template.resolve('myFunc')()).to.equal(true)
  })

  it('Resolve method return empty string if nothing can be found', () => {
    template = new Template(view.engine, '', {}, {})

    expect(template.resolve('myFunc')).to.be.a('string')
    expect(template.resolve('myFunc')).to.equal('')
  })

  it('Safe method returns same string', () => {
    expect(template.safe('{{ "Alice" | capitalize }}')).to.equal('{{ "Alice" | capitalize }}')
  })

  it('Render a string og liquid', () => {
    template = new Template(view.engine, '', {}, {})

    expect(template.renderString('{{ "Alice" | capitalize }}')).to.equal('Alice')
  })

  it('Render a string of liquid with shared data', () => {
    template = new Template(view.engine, '', {}, {})
    template.share({name: 'alice'})

    expect(template.renderString('{{name | capitalize}}')).to.equal('Alice')
  })

  it('Render a string of liquid with passed data', () => {
    template = new Template(view.engine, '', {}, {})

    expect(template.renderString('{{name | capitalize}}', {name: 'alice'})).to.equal('Alice')
  })

  it('Render a string of liquid with a global', () => {
    expect(template.renderString('<a title="my-link" href="{{ "style.css" | asset_url }}">link</a>')).to.equal('<a title="my-link" href="style.css">link</a>')
  })

  it('Render a liquid template', () => {
    expect(template.render('basic')).to.equal('<span>Alice</span>')
  })

  /* TODO */
  /* it('Rendered templates are cached', () => {
    const config = new Config()
    config.set('liquid.cache', true)
    view = new View(new Helpers(path.join(__dirname, './')), config)
    template = view.new()

    expect(template.cache.options.cache.read(template.viewsPath + '/basic.liquid')).to.equal(undefined)
    template.render('basic')

    expect(template.cache.options.cache.read(template.viewsPath + '/basic.liquid')).to.be.a('function')
  }) */

  it('Render a liquid template with dot notation', () => {
    expect(template.render('subdir.template')).to.equal('<h1>In a subdirectory</h1>')
  })

  it('Render a liquid template with given locals', () => {
    expect(template.render('locals', {name: 'alice'})).to.equal('<span>Alice</span>')
  })
})
