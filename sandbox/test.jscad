const { primitives } = require('@jscad/modeling')
const { translate } = require('@jscad/modeling').transforms
const { colorize } = require('@jscad/modeling').colors

const getParameterDefinitions = () => {
  return [
	{ name: 'A', type: 'choice', caption: 'Pedestal Thickness:', values: [1, 3], captions: ['1 mm', '3 mm'], initial: 3 },
	{ name: 'B', type: 'number', initial: 120, min: 1, max: 1000000, step: 1, caption: 'Mesa Height:' },
	{ name: 'C', type: 'number', initial: 20, min: 1, max: 1000000, step: 1, caption: 'Super-Post Height:' },
    { name: 'D', type: 'number', initial: 20, min: 1, max: 1000000, step: 1, caption: 'Post Height:' },
	{ name: 'E', type: 'choice', caption: 'Aperture Diameter:', values: [60, 90], captions: ['60 mm', '90 mm'], initial: 90 },
	{ name: 'F', type: 'number', initial: 15, min: 1, max: 1000, step: 1, caption: 'Mesa Width (mm):' },
	{ name: 'G', type: 'number', initial: 15, min: 1, max: 1000, step: 1, caption: 'Mesa Length (mm):' },
	{ name: 'H', type: 'number', initial: 2000, min: 1, max: 1000000, step: 1, caption: 'Mesa X Border:' },
	{ name: 'J', type: 'number', initial: 2000, min: 1, max: 1000000, step: 1, caption: 'Mesa Y Border:' },
	{ name: 'K', type: 'number', initial: 150, min: 1, max: 1000000, step: 1, caption: 'Post X Pitch:' },
	{ name: 'L', type: 'number', initial: 150, min: 1, max: 1000000, step: 1, caption: 'Post Y Pitch:' },
	{ name: 'M', type: 'number', initial: 10, min: 1, max: 1000000, step: 1, caption: 'Super-Post Width:' },
	{ name: 'N', type: 'number', initial: 10, min: 1, max: 1000000, step: 1, caption: 'Super-Post Length:' },
	{ name: 'P', type: 'number', initial: 10, min: 1, max: 1000000, step: 1, caption: 'Post Width:' },
	{ name: 'Q', type: 'number', initial: 10, min: 1, max: 1000000, step: 1, caption: 'Post Length:' },
	{ name: 'R', type: 'number', initial: 20, min: 1, max: 1000000, step: 1, caption: 'Number Posts X:' },
	{ name: 'S', type: 'number', initial: 28, min: 1, max: 1000000, step: 1, caption: 'Number Posts Y:' }
  ]
}

const main = (params) => {
  const allPrimitives = [
    colorize([1, 1, 0], translate([0, 0, -params.A / 2], primitives.cylinder({ radius: params.E / 2, height: params.A }))),
    translate([0, 0, params.B / 2000], primitives.cuboid({ size: [params.F, params.G, params.B / 1000] }))
  ]
  
  borderX = params.F / -2 + params.H / 1000 + params.M / 2000
  borderY = params.G / -2 + params.J / 1000 + params.N / 2000
  
  for (let x = 0; x < params.R; x++) {
    for (let y = 0; y < params.S; y++) {
	  const cube = translate([-x * params.K / 1000 - borderX, -y * params.L / 1000 - borderY, params.B / 1000], primitives.cuboid({ size: [params.M / 1000, params.N / 1000, params.C / 1000] }))
	  allPrimitives.push(colorize([0, 1, 1], cube))
    }
  }
  
  for (let x = 0; x < params.R; x++) {
    for (let y = 0; y < params.S; y++) {
	  const cube = translate([-x * params.K / 1000 - borderX, -y * params.L / 1000 - borderY, params.B / 1000 + params.C / 1000], primitives.cuboid({ size: [params.P / 1000, params.Q / 1000, params.D / 1000] }))
	  allPrimitives.push(colorize([0, 1, 0], cube))
    }
  }
  
  return allPrimitives
}

module.exports = { main, getParameterDefinitions }