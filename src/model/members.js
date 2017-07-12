import { Node } from './node'
import { Literal, SuperLiteral } from './literals'
import { Block } from './inners'

export const FieldDeclaration = (variable, writeable = true, value = Literal(null)) => Node('FieldDeclaration')({ variable, writeable, value })
export const MethodDeclaration = (name, override = false, native = false) => (...parameters) => (...sentences) => Node('MethodDeclaration')({ name, override, native, parameters, sentences: Block(...sentences) })
export const ConstructorDeclaration = (...parameters) => (baseTarget = SuperLiteral, baseArguments = []) => (...sentences) => Node('ConstructorDeclaration')({ parameters, sentences: Block(...sentences), baseTarget, baseArguments })