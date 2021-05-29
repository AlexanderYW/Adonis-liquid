'use strict'

const path = require('path')

/**
 * View template, the context of this will be tied to one http request
 */
class Template {
  /**
   * @constructor
   *
   * @param  {Object} Engine    Instance of liquid
   * @param  {String} viewsPath Path to views directory
   * @param  {Object} options   Liquid options
   * @param  {Object} globals   Global variables
   * @return {void}
   */
  constructor (Engine, viewsPath, options, globals) {
    this.viewsPath = viewsPath
    this.options = Object.assign({}, options)
    this.globals = Object.assign({}, globals)

    Object.keys(this.globals).map(key => {
      const value = this.globals[key]
      if (typeof value === 'function') {
        this.globals[key] = value.bind(this)
      }
    })

    this.locals = {}
    this.engine = Engine
    this.cache = new Engine(this._getOptions())
  }

  /**
   * Share variables as a local with this template context
   *
   * @param  {Object} locals Key value pairs
   * @return {void}
   */
  share (locals) {
    Object.keys(locals).map(key => {
      if (typeof locals[key] === 'function') {
        locals[key] = locals[key].bind(this)
      }
      this.locals[key] = locals[key]
    })
  }

  /**
   * Render a liquid template
   * @param  {String} template View file (.liquid extension not required)
   * @param  {Object} locals   Variables to be passed to the view
   * @return {String}          HTML rendered output
   */
  render (template, locals) {
    if (locals) {
      this.share(locals)
    }

    template = template.replace('.', path.sep)

    const Engine = this.engine
    return new Engine(this._getOptions()).renderFileSync(path.join(this.viewsPath, `${template}.liquid`), this._getOptions())
  }

  /**
   * Render a string of liquid
   * @param  {String} string String to be rendered
   * @param  {Object} locals Variables to be passed to the view
   * @return {String}        HTML rendered output
   */
  renderString (string, locals) {
    if (locals) {
      this.share(locals)
    }

    const Engine = this.engine
    return new Engine(this._getOptions()).parseAndRenderSync(string, this._getOptions())
  }

  /**
   * Merge locals, options and globals
   * @return {Object}
   */
  _getOptions () {
    return Object.assign(this.locals, Object.assign(this.options, this.globals))
  }

  /**
   * Method used in some globals, returns string
   * @param  {String} string
   * @return {String}
   */
  safe (string) {
    return string
  }

  /**
   * Resolves a key in the following order:
   *
   * 1. View locals
   * 2. View Options
   * 3. View globals
   *
   * @param  {String} key
   * @return {Mixed}
   */
  resolve (key) {
    return this._getOptions()[key] || ''
  }
}

module.exports = Template
