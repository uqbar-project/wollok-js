const { assign, keys } = Object

//===============================================================================================================================
// BEHAVIOUR
//===============================================================================================================================

const nodeBehaviour = {
  is(typeOrCategory) {
    return typeOrCategory.toString().split(',').some(type => this.type === type)
  },

  copy(diff) {
    const clone = { ...this }
    for (const key in diff) {
      clone[key] = diff[key] instanceof Function ? diff[key](clone[key]) : diff[key]
    }
    return clone
  }
}

export const traverse = configuration => assign(model => {
  const applicableTxs = keys(configuration).filter(key => model.is(key))
  if (applicableTxs.length < 1) throw new TypeError(`No matching traverse strategy for ${model.type} node`)
  return configuration[applicableTxs[0]](model)
}, configuration)

export const node = builder => body => ({ type: builder instanceof Function ? builder.name : builder, ...body, ...nodeBehaviour })

//===============================================================================================================================
// NODES
//===============================================================================================================================

export const File = (...content) => node(File)({ content })

export const Parameter = (name, varArg = false) => node(Parameter)({ name, varArg })

export const Block = (...sentences) => node(Block)({ sentences })

//-------------------------------------------------------------------------------------------------------------------------------
// TOP LEVEL
//-------------------------------------------------------------------------------------------------------------------------------

export const Import = (target) => node(Import)({ target })
export const Package = (name) => (...elements) => node(Package)({ name, elements })

export const Class = (name) => (superclass = name === 'Object' ? undefined : 'Object', ...mixins) => (...members) => node(Class)({ name, superclass, mixins, members })
export const Mixin = (name) => (...members) => node(Mixin)({ name, members })
export const Singleton = (name = undefined) => (superclass = 'Object', superArguments = [], ...mixins) => (...members) => node(Singleton)({ name, superclass, superArguments, mixins, members })

export const Program = (name) => (...sentences) => node(Program)({ name, sentences: Block(...sentences) })
export const Test = (description) => (...sentences) => node(Program)({ description, sentences: Block(...sentences) })

//-------------------------------------------------------------------------------------------------------------------------------
// MEMBERS
//-------------------------------------------------------------------------------------------------------------------------------

export const Field = (variable, writeable = true, value = Literal(null)) => node(Field)({ variable, writeable, value })
export const Method = (name, override = false, native = false) => (...parameters) => (...sentences) => node(Method)({ name, override, native, parameters, sentences: Block(...sentences) })
export const Constructor = (...parameters) => (baseArguments = [], lookUpCall = true) => (...sentences) => node(Constructor)({ parameters, sentences: Block(...sentences), lookUpCall, baseArguments })

//-------------------------------------------------------------------------------------------------------------------------------
// SENTENCES
//-------------------------------------------------------------------------------------------------------------------------------

export const VariableDeclaration = (variable, writeable = true, value) => node(VariableDeclaration)({ variable, writeable, value })
export const Return = (result) => node(Return)({ result })
export const Assignment = (variable, value) => node(Assignment)({ variable, value })

//-------------------------------------------------------------------------------------------------------------------------------
// EXPRESSIONS
//-------------------------------------------------------------------------------------------------------------------------------

export const Variable = (name) => node(Variable)({ name })
export const Literal = (value) => node(Literal)({ value })
export const List = (...values) => node(List)({ values })
export const Closure = (...parameters) => (...sentences) => node(Closure)({ parameters, sentences: Block(...sentences) })

export const Send = (target, key) => (...parameters) => node(Send)({ target, key, parameters })
export const Super = (...parameters) => node(Super)({ parameters })

export const New = (target) => (...parameters) => node(New)({ target, parameters })

export const If = (condition) => (...thenSentences) => (...elseSentences) => node(If)({ condition, thenSentences: Block(...thenSentences), elseSentences: Block(...elseSentences) })
export const Throw = (exception) => node(Throw)({ exception })
export const Try = (...sentences) => (...catches) => (...always) => node(Try)({ sentences: Block(...sentences), catches, always: Block(...always) })
export const Catch = (variable, errorType) => (...handler) => node(Catch)({ variable, errorType, handler: Block(...handler) })

//===============================================================================================================================
// CATEGORIES
//===============================================================================================================================

export const TopLevel = [Import, Package, Class, Mixin, Singleton, Program, Test]
export const Member = [Field, Method, Constructor]
export const Sentence = [VariableDeclaration, Return, Assignment]
export const Expression = [Variable, Literal, List, Closure, Send, Super, New, If, Throw, Try]
export const Node = [File, ...TopLevel, ...Member, ...Sentence, ...Expression, Catch, Parameter, Block]

Node.forEach(builder => { builder.toString = () => builder.name })

