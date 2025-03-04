/**
Copyright 2021 Forestry.io Holdings, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
export interface TinaCloudSchema<WithNamespace extends boolean> {
  templates?: GlobalTemplate<WithNamespace>[];
  collections: TinaCloudCollection<WithNamespace>[];
}
export declare type TinaCloudSchemaBase = TinaCloudSchema<false>;
export declare type TinaCloudSchemaEnriched = TinaCloudSchema<true>;
/**
 * As part of the build process, each node is given a `path: string[]` key
 * to help with namespacing type names, this is added as part of the
 * createTinaSchema step
 */
export interface TinaCloudSchemaWithNamespace {
  templates?: GlobalTemplate<true>[];
  collections: TinaCloudCollection<true>[];
  namespace: string[];
}
export declare type TinaCloudCollection<WithNamespace extends boolean> =
  | CollectionFields<WithNamespace>
  | CollectionTemplates<WithNamespace>;
export declare type TinaCloudCollectionBase = TinaCloudCollection<false>;
export declare type TinaCloudCollectionEnriched = TinaCloudCollection<true>;
declare type FormatType = "json" | "md" | "markdown" | "mdx";
interface BaseCollection {
  label: string;
  name: string;
  path: string;
  format?: FormatType;
  match?: string;
}
declare type CollectionTemplates<WithNamespace extends boolean> =
  WithNamespace extends true
    ? CollectionTemplatesWithNamespace<WithNamespace>
    : CollectionTemplatesInner<WithNamespace>;
interface CollectionTemplatesInner<WithNamespace extends boolean>
  extends BaseCollection {
  templates: (string | Template<WithNamespace>)[];
  fields?: undefined;
}
export interface CollectionTemplatesWithNamespace<WithNamespace extends boolean>
  extends BaseCollection {
  templates: (string | Template<WithNamespace>)[];
  fields?: undefined;
  references?: ReferenceType<WithNamespace>[];
  namespace: WithNamespace extends true ? string[] : undefined;
}
declare type CollectionFields<WithNamespace extends boolean> =
  WithNamespace extends true
    ? CollectionFieldsWithNamespace<WithNamespace>
    : CollectionFieldsInner<WithNamespace>;
export interface CollectionFieldsWithNamespace<WithNamespace extends boolean>
  extends BaseCollection {
  fields: string | TinaFieldInner<WithNamespace>[];
  templates?: undefined;
  references?: ReferenceType<WithNamespace>[];
  namespace: string[];
}
interface CollectionFieldsInner<WithNamespace extends boolean>
  extends BaseCollection {
  fields: string | TinaFieldInner<WithNamespace>[];
  templates?: undefined;
}
export declare type TinaFieldInner<WithNamespace extends boolean> =
  | ScalarType<WithNamespace>
  | ObjectType<WithNamespace>
  | ReferenceType<WithNamespace>
  | RichType<WithNamespace>;
export declare type TinaFieldBase = TinaFieldInner<false>;
export declare type TinaFieldEnriched = TinaFieldInner<true>;
interface TinaField {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  list?: boolean;
  /**
   * Any items passed to the UI field will be passed to the underlying field.
   * NOTE: only serializable values are supported, so functions like `validate`
   * will be ignored.
   */
  ui?: object;
}
declare type ScalarType<WithNamespace extends boolean> =
  WithNamespace extends true ? ScalarTypeWithNamespace : ScalarTypeInner;
declare type Option =
  | string
  | {
      label: string;
      value: string;
    };
declare type ScalarTypeInner = TinaField &
  TinaScalarField & {
    options?: Option[];
  };
declare type ScalarTypeWithNamespace = TinaField &
  TinaScalarField & {
    options?: Option[];
    namespace: string[];
  };
declare type TinaScalarField =
  | StringField
  | BooleanField
  | DateTimeField
  | NumberField
  | ImageField;
declare type StringField = {
  type: "string";
  isBody?: boolean;
};
declare type BooleanField = {
  type: "boolean";
};
declare type NumberField = {
  type: "number";
};
declare type DateTimeField = {
  type: "datetime";
  dateFormat?: string;
  timeFormat?: string;
};
declare type ImageField = {
  type: "image";
};
export declare type ReferenceType<WithNamespace extends boolean> =
  WithNamespace extends true ? ReferenceTypeWithNamespace : ReferenceTypeInner;
export declare type RichType<WithNamespace extends boolean> =
  WithNamespace extends true ? RichTypeWithNamespace : RichTypeInner;
export interface ReferenceTypeInner extends TinaField {
  type: "reference";
  reverseLookup?: {
    label: string;
    name: string;
  };
  collections: string[];
}
export interface ReferenceTypeWithNamespace extends TinaField {
  type: "reference";
  collections: string[];
  reverseLookup?: {
    label: string;
    name: string;
  };
  namespace: string[];
}
export interface RichTypeWithNamespace extends TinaField {
  type: "rich-text";
  namespace: string[];
  isBody?: boolean;
  templates?: (
    | string
    | (Template<true> & {
        inline?: boolean;
      })
  )[];
}
export interface RichTypeInner extends TinaField {
  type: "rich-text";
  isBody?: boolean;
  templates?: (
    | string
    | (Template<false> & {
        inline?: boolean;
      })
  )[];
}
export declare type ObjectType<WithNamespace extends boolean> =
  | ObjectTemplates<WithNamespace>
  | ObjectFields<WithNamespace>;
declare type ObjectTemplates<WithNamespace extends boolean> =
  WithNamespace extends true
    ? ObjectTemplatesWithNamespace<WithNamespace>
    : ObjectTemplatesInner<WithNamespace>;
interface ObjectTemplatesInner<WithNamespace extends boolean>
  extends TinaField {
  type: "object";
  /**
   * templates can either be an array of Tina templates or a reference to
   * global template definition.
   *
   * You should use `templates` when your object can be any one of multiple shapes (polymorphic)
   *
   * You can only provide one of `fields` or `template`, but not both
   */
  templates: (string | Template<WithNamespace>)[];
  fields?: undefined;
}
interface ObjectTemplatesWithNamespace<WithNamespace extends boolean>
  extends TinaField {
  type: "object";
  /**
   * templates can either be an array of Tina templates or a reference to
   * global template definition.
   *
   * You should use `templates` when your object can be any one of multiple shapes (polymorphic)
   *
   * You can only provide one of `fields` or `template`, but not both
   */
  templates: (string | Template<WithNamespace>)[];
  fields?: undefined;
  namespace: WithNamespace extends true ? string[] : undefined;
}
declare type ObjectFields<WithNamespace extends boolean> =
  WithNamespace extends true
    ? InnerObjectFieldsWithNamespace<WithNamespace>
    : InnerObjectFields<WithNamespace>;
interface InnerObjectFields<WithNamespace extends boolean> extends TinaField {
  type: "object";
  /**
   * fields can either be an array of Tina fields, or a reference to the fields
   * of a global template definition.
   *
   * You can only provide one of `fields` or `templates`, but not both.
   */
  fields: string | TinaFieldInner<WithNamespace>[];
  templates?: undefined;
}
interface InnerObjectFieldsWithNamespace<WithNamespace extends boolean>
  extends TinaField {
  type: "object";
  /**
   * fields can either be an array of Tina fields, or a reference to the fields
   * of a global template definition.
   *
   * You can only provide one of `fields` or `templates`, but not both.
   */
  fields: string | TinaFieldInner<WithNamespace>[];
  templates?: undefined;
  namespace: WithNamespace extends true ? string[] : undefined;
}
/**
 * Global Templates are defined once, and can be used anywhere by referencing the 'name' of the template
 *
 * TODO: ensure we don't permit infite loop with self-references
 */
export declare type GlobalTemplate<WithNamespace extends boolean> =
  WithNamespace extends true
    ? {
        label: string;
        name: string;
        ui?: object;
        fields: TinaFieldInner<WithNamespace>[];
        namespace: WithNamespace extends true ? string[] : undefined;
      }
    : {
        label: string;
        name: string;
        ui?: object;
        fields: TinaFieldInner<WithNamespace>[];
      };
export declare type TinaCloudTemplateBase = GlobalTemplate<false>;
export declare type TinaCloudTemplateEnriched = GlobalTemplate<true>;
/**
 * Templates allow you to define an object as polymorphic
 */
export declare type Template<WithNamespace extends boolean> =
  WithNamespace extends true
    ? {
        label: string;
        name: string;
        fields: TinaFieldInner<WithNamespace>[];
        ui?: object;
        namespace: WithNamespace extends true ? string[] : undefined;
      }
    : {
        label: string;
        name: string;
        ui?: object;
        fields: TinaFieldInner<WithNamespace>[];
      };
export declare type CollectionTemplateableUnion = {
  namespace: string[];
  type: "union";
  templates: Templateable[];
};
export declare type CollectionTemplateableObject = {
  namespace: string[];
  type: "object";
  template: Templateable;
};
export declare type CollectionTemplateable =
  | CollectionTemplateableUnion
  | CollectionTemplateableObject;
export declare type Collectable = {
  namespace: string[];
  templates?: (string | Templateable)[];
  fields?: string | TinaFieldEnriched[];
  references?: ReferenceType<true>[];
};
export declare type Templateable = {
  name: string;
  namespace: string[];
  fields: TinaFieldEnriched[];
  ui?: object;
};
export {};
