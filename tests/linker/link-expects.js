import { expect } from 'chai'
import { link } from '../../src/linker/link'
import { queryNodeByType } from '../../src/linker/visiting'
import parser from '../../src/parser'

// expect utils for

export const expectNoLinkageError = code => link(parser.parse(code))
export const expectUnresolvedVariable = (variable, code) => expect(() =>
  link(parser.parse(code))
).to.throw(`Cannot resolve reference to '${variable}' at ???`)

export const expectScopeHasNames = (node, expected) => expect(Object.keys(node.scope)).to.deep.equal(expected)
export const expectScopeOf = (program, type, findFilter, expected) => {
  expectScopeHasNames(
    queryNodeByType(link(parser.parse(program)), type.name, findFilter)[0],
    expected
  )
}