'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const { Helpers, Config } = require('@adonisjs/sink')

describe('View Class', () => {
  it('View has liquid rendering engine', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.engine.name).to.equal('Liquid')
  })

  it('Add a global value', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.globals.myValue).to.equal(undefined)

    view.global('myValue', 'a-string')

    expect(view.globals.myValue).to.equal('a-string')
  })

  it('Return a new template', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.new()).to.be.an('object')
    expect(view.new().engine).to.equal(view.engine)
  })

  it('Options set in config are sent to liquid', () => {
    const config = new Config()

    config.set('liquid.pretty', true)
    config.set('liquid.cache', 1)
    config.set('liquid.doctype', 'strict')
    config.set('liquid.filters', {myFilter: text => text.toUpperCase()})
    config.set('liquid.self', 'yes')
    config.set('liquid.debug', true)

    const view = new View(new Helpers(path.join(__dirname, './')), config)

    expect(view.options.pretty).to.equal(true)
    expect(view.options.cache).to.equal(true)
    expect(view.options.doctype).to.equal('strict')
    expect(view.options.filters.myFilter).to.be.a('function')
    expect(view.options.self).to.equal(true)
    expect(view.options.debug).to.equal(true)
  })

  it('Share method adds to locals and returns template instance', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())
    const template = view.share({myKey: 'some-string'})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myKey).to.equal('some-string')
  })

  it('Render a string of liquid', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.renderString('{{name | capitalize}}', {name: 'alice'})).to.equal('Alice')
  })

  it('Render a liquid template', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.render('basic')).to.equal('<span>Alice</span>')
  })
})
