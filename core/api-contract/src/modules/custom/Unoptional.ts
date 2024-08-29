type UnOptional<TypeOrUndefined, UndefinedReplacement> =
  TypeOrUndefined extends undefined ? UndefinedReplacement : TypeOrUndefined;
