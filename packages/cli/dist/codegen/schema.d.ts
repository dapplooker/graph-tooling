import Schema from '../schema';
import * as tsCodegen from './typescript';
import type { DefinitionNode, FieldDefinitionNode, InterfaceTypeDefinitionNode, NamedTypeNode, ObjectTypeDefinitionNode, TypeNode } from 'graphql/language';
declare class IdField {
    static BYTES: symbol;
    static STRING: symbol;
    private kind;
    constructor(idField: FieldDefinitionNode | undefined);
    typeName(): "string" | "Bytes";
    gqlTypeName(): "Bytes" | "String";
    tsNamedType(): tsCodegen.NamedType;
    tsValueFrom(): "Value.fromBytes(id)" | "Value.fromString(id)";
    tsValueKind(): "ValueKind.BYTES" | "ValueKind.STRING";
    tsValueToString(): "id.toBytes().toHexString()" | "id.toString()";
    tsToString(): "id" | "id.toHexString()";
    static fromFields(fields: readonly FieldDefinitionNode[] | undefined): IdField;
    static fromTypeDef(def: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode): IdField;
}
export default class SchemaCodeGenerator {
    private schema;
    constructor(schema: Schema);
    generateModuleImports(): tsCodegen.ModuleImports[];
    generateTypes(): Array<tsCodegen.Class>;
    _isEntityTypeDefinition(def: DefinitionNode): def is ObjectTypeDefinitionNode;
    _isInterfaceDefinition(def: DefinitionNode): def is InterfaceTypeDefinitionNode;
    _generateEntityType(def: ObjectTypeDefinitionNode): tsCodegen.Class;
    _generateConstructor(_entityName: string, fields: readonly FieldDefinitionNode[] | undefined): tsCodegen.Method;
    _generateStoreMethods(entityName: string, idField: IdField): Array<tsCodegen.Method | tsCodegen.StaticMethod>;
    _generateEntityFieldMethods(entityDef: ObjectTypeDefinitionNode, fieldDef: FieldDefinitionNode): Array<tsCodegen.Method>;
    _generateEntityFieldGetter(_entityDef: ObjectTypeDefinitionNode, fieldDef: FieldDefinitionNode): tsCodegen.Method;
    _generateEntityFieldSetter(_entityDef: ObjectTypeDefinitionNode, fieldDef: FieldDefinitionNode): tsCodegen.Method | null;
    _resolveFieldType(gqlType: NamedTypeNode): string;
    /** Return the type that values for this field must have. For scalar
     * types, that's the type from the subgraph schema. For references to
     * other entity types, this is the same as the type of the id of the
     * referred type, i.e., `string` or `Bytes`*/
    _valueTypeFromGraphQl(gqlType: TypeNode): string;
    /** Determine the base type of `gqlType` by removing any non-null
     * constraints and using the type of elements of lists */
    _baseType(gqlType: TypeNode): string;
    _typeFromGraphQl(gqlType: TypeNode, nullable?: boolean): tsCodegen.ArrayType | tsCodegen.NullableType | tsCodegen.NamedType;
}
export {};
