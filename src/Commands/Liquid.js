'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')

/**
 * Make a new liquid view
 *
 * @class MakeLiquid
 * @constructor
 */
class MakeLiquid extends Command {
  /**
   * @return {String} The command signature
   */
  static get signature () {
    return `
    make:liquid
    { name: Name of the view }
    { -l, --layout=@value: Define a layout to extend }
    `
  }

  /**
   * @return {String} The command description
   */
  static get description () {
    return 'Make a liquid view file'
  }

  /**
   * Handle method executed by ace
   *
   * @param  {String} args.name       Name of the view file
   * @param  {String} options.layout  Define a layout to extend
   * @return {void}
   */
  async handle ({ name }, { layout }) {
    try {
      await this.ensureInProjectRoot()
      return await this.generateBlueprint(name, layout)
    } catch ({ message }) {
      this.error(message)
    }
  }

  /**
   * Ensures the command is executed within the
   * project root
   *
   * @throws {Error} If not in app root
   * @return {void}
   */
  async ensureInProjectRoot () {
    const acePath = path.join(process.cwd(), 'ace')
    const exists = await this.pathExists(acePath)

    if (!exists) {
      throw new Error(`Make sure you are inside an Adonisjs app to run the make liquid command`)
    }
  }

  /**
   * Generate liquid file
   *
   * @param  {String}  name     template filename
   * @param  {String}  [layout] layout to extend in liquid file
   * @return {String}           Created file path
   */
  async generateBlueprint (name, layout) {
    const templateFile = path.join(__dirname, './liquid.mustache')

    const filePath = path.join(process.cwd(), 'resources/views', name.toLowerCase().replace(/view/ig, '').replace(/\./g, '/')) + '.liquid'
    const data = {
      layout: layout && typeof (layout) === 'string' ? layout.replace('.liquid', '') : null
    }

    const templateContents = await this.readFile(templateFile, 'utf-8')
    await this.generateFile(filePath, templateContents, data)

    const createdFile = filePath.replace(process.cwd(), '').replace(path.sep, '')
    console.info(`${this.icon('success')} ${this.chalk.green('create')}  ${createdFile}`)

    return createdFile
  }
}

module.exports = MakeLiquid
