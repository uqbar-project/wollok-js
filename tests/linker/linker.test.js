import { expect } from 'chai'
import { expectNoLinkageError } from './link-expects'
import { scopeFor } from '../../src/linker/scoping'
import { queryNodeByType } from '../../src/visitors/visiting'

// tests

describe('linker', () => {

  describe('Variable resolution', () => {

    describe('Nesting', () => {
      it('method => class(instance var)', () => {
        expectNoLinkageError(`
          class Bird {
            const energy = 23
            method fly(kms) {
              energy -= kms
            }
          }
        `)
      })
      it('closure => method(local + params) => class(instvars)', () => {
        expectNoLinkageError(`
          class Bird {
            const energy = 23
            method fly(kms) {
              const b = 23
              const closure = { a => b + kms + a + energy }
            }
          }
        `)
      })

      it('closure => program(local)', () => {
        expectNoLinkageError(`
          program p {
            const a = 23
            const closure = { b => a + b }
          }
        `)
      })

      it('closure => method(local + params) => object(instVar)', () => {
        expectNoLinkageError(`
          object pepita {
            const energy = 23
            method fly(kms) {
              const b = 23
              const closure = { a => b + kms + a + energy }
            }
          }
        `)
      })
    })

  })

  describe('scoping', () => {
    it('resolves own scope + parent', () => {
      const n = expectNoLinkageError(`
        class Person {
          var name
          method setName(newName) {
            name = newName
          }
        }
      `)
      const setName = queryNodeByType(n, 'Method')[0]
      expect(Object.keys(scopeFor(setName))).to.deep.equals([
        'newName',
        'name',
        'Person'
      ])
    })
  })

})