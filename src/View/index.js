'use strict'

const { Liquid } = require('liquidjs')
const AdonisView = require('@adonisjs/framework/src/View')
const Template = require('../Template')

/**
 * @class View
 * @extends AdonisView
 */
class View extends AdonisView {
  /**
   * @constructor
   *
   * @param  {Object} Helpers Adonis Helpers instance
   * @param  {Object} Config  Adonis Config instance
   * @return {void}
   */
  constructor (Helpers, Config) {
    super(Helpers)

    this.viewsPath = Helpers.viewsPath()

    this.options = {
      root: this.viewsPath,
      pretty: !!Config.get('liquid.pretty') || false,
      cache: !!Config.get('liquid.cache') || false,
      doctype: Config.get('liquid.doctype') || undefined,
      filters: Config.get('liquid.filters') || {},
      self: !!Config.get('liquid.self') || false,
      compileDebug: !!Config.get('liquid.compileDebug') || false,
      debug: !!Config.get('liquid.debug') || false
    }

    this.globals = {}

    this.engine = Liquid
  }

  /**
   * Create new template instance
   * @return {Template}
   */
  new () {
    return new Template(this.engine, this.viewsPath, this.options, this.globals)
  }

  /**
   * Share variables as a local with this template context
   *
   * @param  {Object} locals Key value pairs
   * @return {Template}      New template instance with locals setup
   */
  share (...args) {
    const template = this.new()
    template.share(...args)
    return template
  }

  /**
   * Render a liquid template
   * @param  {String} template View file (.liquid extension not required)
   * @param  {Object} locals   Variables to be passed to the view
   * @return {String}          HTML rendered output
   */
  render (...args) {
    return this.new().render(...args)
  }

  /**
   * Render a string of liquid
   * @param  {String} string String to be rendered
   * @param  {Object} locals Variables to be passed to the view
   * @return {String}        HTML rendered output
   */
  renderString (...args) {
    return this.new().renderString(...args)
  }

  /**
   * Add a global variable
   * @param  {String} key  Variable name
   * @param  {Mixed} value Contents of variable
   * @return {void}
   */
  global (key, value) {
    this.globals[key] = value
  }
}

module.exports = View
