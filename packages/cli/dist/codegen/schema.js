"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesCodegen = __importStar(require("./types"));
const tsCodegen = __importStar(require("./typescript"));
class IdField {
    constructor(idField) {
        if (idField?.type.kind !== 'NonNullType') {
            throw Error('id field must be non-nullable');
        }
        if (idField.type.type.kind !== 'NamedType') {
            throw Error('id field must be a named type');
        }
        const typeName = idField.type.type.name.value;
        this.kind = typeName === 'Bytes' ? IdField.BYTES : IdField.STRING;
    }
    typeName() {
        return this.kind === IdField.BYTES ? 'Bytes' : 'string';
    }
    gqlTypeName() {
        return this.kind === IdField.BYTES ? 'Bytes' : 'String';
    }
    tsNamedType() {
        return tsCodegen.namedType(this.typeName());
    }
    tsValueFrom() {
        return this.kind === IdField.BYTES ? 'Value.fromBytes(id)' : 'Value.fromString(id)';
    }
    tsValueKind() {
        return this.kind === IdField.BYTES ? 'ValueKind.BYTES' : 'ValueKind.STRING';
    }
    tsValueToString() {
        return this.kind == IdField.BYTES ? 'id.toBytes().toHexString()' : 'id.toString()';
    }
    tsToString() {
        return this.kind == IdField.BYTES ? 'id.toHexString()' : 'id';
    }
    static fromFields(fields) {
        const idField = fields?.find(field => field.name.value === 'id');
        return new IdField(idField);
    }
    static fromTypeDef(def) {
        return IdField.fromFields(def.fields);
    }
}
IdField.BYTES = Symbol('Bytes');
IdField.STRING = Symbol('String');
class SchemaCodeGenerator {
    constructor(schema) {
        this.schema = schema;
        this.schema = schema;
    }
    generateModuleImports() {
        return [
            tsCodegen.moduleImports([
                // Base classes
                'TypedMap',
                'Entity',
                'Value',
                'ValueKind',
                // APIs
                'store',
                // Basic Scalar types
                'Bytes',
                'BigInt',
                'BigDecimal',
            ], '@graphprotocol/graph-ts'),
        ];
    }
    generateTypes() {
        return this.schema.ast.definitions
            .map(def => {
            if (this._isEntityTypeDefinition(def)) {
                return this._generateEntityType(def);
            }
        })
            .filter(Boolean);
    }
    _isEntityTypeDefinition(def) {
        return (def.kind === 'ObjectTypeDefinition' &&
            def.directives?.find(directive => directive.name.value === 'entity') !== undefined);
    }
    _isInterfaceDefinition(def) {
        return def.kind === 'InterfaceTypeDefinition';
    }
    _generateEntityType(def) {
        const name = def.name.value;
        const klass = tsCodegen.klass(name, { export: true, extends: 'Entity' });
        const fields = def.fields;
        const idField = IdField.fromFields(fields);
        // Generate and add a constructor
        klass.addMethod(this._generateConstructor(name, fields));
        // Generate and add save() and getById() methods
        this._generateStoreMethods(name, idField).forEach(method => klass.addMethod(method));
        // Generate and add entity field getters and setters
        def.fields
            ?.reduce((methods, field) => methods.concat(this._generateEntityFieldMethods(def, field)), [])
            .forEach((method) => klass.addMethod(method));
        return klass;
    }
    _generateConstructor(_entityName, fields) {
        const idField = IdField.fromFields(fields);
        return tsCodegen.method('constructor', [tsCodegen.param('id', idField.tsNamedType())], undefined, `
      super()
      this.set('id', ${idField.tsValueFrom()})
      `);
    }
    _generateStoreMethods(entityName, idField) {
        return [
            tsCodegen.method('save', [], tsCodegen.namedType('void'), `
        let id = this.get('id')
        assert(id != null,
               'Cannot save ${entityName} entity without an ID')
        if (id) {
          assert(id.kind == ${idField.tsValueKind()},
                 \`Entities of type ${entityName} must have an ID of type ${idField.gqlTypeName()} but the id '\${id.displayData()}' is of type \${id.displayKind()}\`)
          store.set('${entityName}', ${idField.tsValueToString()}, this)
        }`),
            tsCodegen.staticMethod('loadInBlock', [tsCodegen.param('id', tsCodegen.namedType(idField.typeName()))], tsCodegen.nullableType(tsCodegen.namedType(entityName)), `
        return changetype<${entityName} | null>(store.get_in_block('${entityName}', ${idField.tsToString()}))
        `),
            tsCodegen.staticMethod('load', [tsCodegen.param('id', tsCodegen.namedType(idField.typeName()))], tsCodegen.nullableType(tsCodegen.namedType(entityName)), `
        return changetype<${entityName} | null>(store.get('${entityName}', ${idField.tsToString()}))
        `),
        ];
    }
    _generateEntityFieldMethods(entityDef, fieldDef) {
        return [
            this._generateEntityFieldGetter(entityDef, fieldDef),
            this._generateEntityFieldSetter(entityDef, fieldDef),
        ]
            // generator can return null if the field is not supported
            // so we filter all falsy values
            .filter(Boolean);
    }
    _generateEntityFieldGetter(_entityDef, fieldDef) {
        const name = fieldDef.name.value;
        const gqlType = fieldDef.type;
        const fieldValueType = this._valueTypeFromGraphQl(gqlType);
        const returnType = this._typeFromGraphQl(gqlType);
        const isNullable = returnType instanceof tsCodegen.NullableType;
        const primitiveDefault = returnType instanceof tsCodegen.NamedType ? returnType.getPrimitiveDefault() : null;
        const getNonNullable = `if (!value || value.kind == ValueKind.NULL) {
                          ${primitiveDefault === null
            ? "throw new Error('Cannot return null for a required field.')"
            : `return ${primitiveDefault}`}
                        } else {
                          return ${typesCodegen.valueToAsc('value', fieldValueType)}
                        }`;
        const getNullable = `if (!value || value.kind == ValueKind.NULL) {
                          return null
                        } else {
                          return ${typesCodegen.valueToAsc('value', fieldValueType)}
                        }`;
        return tsCodegen.method(`get ${name}`, [], returnType, `
       let value = this.get('${name}')
       ${isNullable ? getNullable : getNonNullable}
      `);
    }
    _generateEntityFieldSetter(_entityDef, fieldDef) {
        const name = fieldDef.name.value;
        const isDerivedField = !!fieldDef.directives?.find(directive => directive.name.value === 'derivedFrom');
        // We cannot have setters for derived fields
        if (isDerivedField)
            return null;
        const gqlType = fieldDef.type;
        const fieldValueType = this._valueTypeFromGraphQl(gqlType);
        const paramType = this._typeFromGraphQl(gqlType);
        const isNullable = paramType instanceof tsCodegen.NullableType;
        const paramTypeString = isNullable ? paramType.inner.toString() : paramType.toString();
        const isArray = paramType instanceof tsCodegen.ArrayType;
        if (isArray && paramType.inner instanceof tsCodegen.NullableType) {
            const baseType = this._baseType(gqlType);
            throw new Error(`
GraphQL schema can't have List's with Nullable members.
Error in '${name}' field of type '[${baseType}]'.
Suggestion: add an '!' to the member type of the List, change from '[${baseType}]' to '[${baseType}!]'`);
        }
        const setNonNullable = `
      this.set('${name}', ${typesCodegen.valueFromAsc(`value`, fieldValueType)})
    `;
        const setNullable = `
      if (!value) {
        this.unset('${name}')
      } else {
        this.set('${name}', ${typesCodegen.valueFromAsc(`<${paramTypeString}>value`, fieldValueType)})
      }
    `;
        return tsCodegen.method(`set ${name}`, [tsCodegen.param('value', paramType)], undefined, isNullable ? setNullable : setNonNullable);
    }
    _resolveFieldType(gqlType) {
        const typeName = gqlType.name.value;
        // If this is a reference to another type, the field has the type of
        // the referred type's id field
        const typeDef = this.schema.ast.definitions?.find(def => (this._isEntityTypeDefinition(def) || this._isInterfaceDefinition(def)) &&
            def.name.value === typeName);
        if (typeDef) {
            return IdField.fromTypeDef(typeDef).typeName();
        }
        return typeName;
    }
    /** Return the type that values for this field must have. For scalar
     * types, that's the type from the subgraph schema. For references to
     * other entity types, this is the same as the type of the id of the
     * referred type, i.e., `string` or `Bytes`*/
    _valueTypeFromGraphQl(gqlType) {
        if (gqlType.kind === 'NonNullType') {
            return this._valueTypeFromGraphQl(gqlType.type);
        }
        if (gqlType.kind === 'ListType') {
            return '[' + this._valueTypeFromGraphQl(gqlType.type) + ']';
        }
        return this._resolveFieldType(gqlType);
    }
    /** Determine the base type of `gqlType` by removing any non-null
     * constraints and using the type of elements of lists */
    _baseType(gqlType) {
        if (gqlType.kind === 'NonNullType') {
            return this._baseType(gqlType.type);
        }
        if (gqlType.kind === 'ListType') {
            return this._baseType(gqlType.type);
        }
        return gqlType.name.value;
    }
    _typeFromGraphQl(gqlType, nullable = true) {
        if (gqlType.kind === 'NonNullType') {
            return this._typeFromGraphQl(gqlType.type, false);
        }
        if (gqlType.kind === 'ListType') {
            const type = tsCodegen.arrayType(this._typeFromGraphQl(gqlType.type));
            return nullable ? tsCodegen.nullableType(type) : type;
        }
        // NamedType
        const type = tsCodegen.namedType(typesCodegen.ascTypeForValue(this._resolveFieldType(gqlType)));
        // In AssemblyScript, primitives cannot be nullable.
        return nullable && !type.isPrimitive() ? tsCodegen.nullableType(type) : type;
    }
}
exports.default = SchemaCodeGenerator;
