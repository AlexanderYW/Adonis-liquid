'use strict'

const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const path = require('path')

const MakeLiquid = require('../src/Commands/Liquid')

let makeLiquid
let generateFileStub
let consoleStub
let existsStub

describe('Make Liquid view command', () => {
  beforeEach(() => {
    makeLiquid = new MakeLiquid()

    existsStub = sinon.stub(makeLiquid, 'pathExists').returns(true)
    generateFileStub = sinon.stub(makeLiquid, 'generateFile').resolves(true)

    consoleStub = sinon.stub(console, 'info')
  })

  afterEach(() => {
    generateFileStub.restore()
    consoleStub.restore()
  })

  it('Has a signature and description', () => {
    expect(MakeLiquid.signature).to.be.a('string')
    expect(MakeLiquid.description).to.be.a('string')
  })

  it('Generate test.liquid in resources/views', async () => {
    const handle = await makeLiquid.handle({name: 'test'}, {})

    expect(handle).to.equal('resources/views/test.liquid')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/test.liquid'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/test.liquid')
  })

  it('Generate test.liquid in resources/views with a layout', async () => {
    const handle = await makeLiquid.handle({name: 'extender'}, {layout: 'layout.liquid'})

    expect(handle).to.equal('resources/views/extender.liquid')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/extender.liquid'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/extender.liquid')
  })

  it('Handles error ', async () => {
    existsStub.restore()
    existsStub = sinon.stub(makeLiquid, 'pathExists').returns(false)

    const errorStub = sinon.stub(makeLiquid, 'error')

    const handle = await makeLiquid.handle({name: 'extender'}, {layout: 'layout.liquid'})

    expect(handle).to.equal(undefined)
    expect(errorStub).to.be.calledWith('Make sure you are inside an Adonisjs app to run the make liquid command')

    errorStub.restore()
  })
})
