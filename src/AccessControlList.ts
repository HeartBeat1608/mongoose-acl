import { randomInt, randomUUID } from "crypto";
import { Model } from "mongoose";

type AttributePosession = "own" | "any";
type AttributeAction = "read" | "create" | "delete" | "update";

export type AttributeList = `${AttributeAction}:${AttributePosession}` | "*";

interface GrantType {
  resource: string;
  role: string;
  attributes: AttributeList[];
}

export interface AccessControlListOptions {
  grants?: GrantType[];
  name?: string;
  code?: string;
  id?: string;
}

export class AccessControlList {
  private grants: GrantType[] = [];
  private name: string = "";
  private code: string = "";
  private id: string = "";

  constructor(args?: AccessControlListOptions) {
    if (args) {
      this.grants = args.grants || [];
      this.id = args.id || randomUUID({ disableEntropyCache: true });
      this.name = args.name || "acl";
      this.code = args.code || "acl" + randomInt(1e5).toFixed(0);
    } else {
      this.grants = [];
      this.id = randomUUID({ disableEntropyCache: true });
      this.name = "acl";
      this.code = "acl" + randomInt(1e5).toFixed(0);
    }
  }

  public get Name(): string {
    return this.name;
  }

  public get Code(): string {
    return this.code;
  }

  public get _id(): string {
    return this.id;
  }

  /**
   * Allow a user or role to access a resource with provided context.
   * @param role String based role. e.g. `user`
   * @param resource Resource Model to be accessed. This is the compiled mongoose model which will be matched with the grants set.
   * @param context list of actions that are allowed.
   */
  allow(role: string, resource: Model<any>, context: AttributeList[]) {
    // filter the grants to find the role
    const grants_index = this.grants.findIndex(
      (t) => t.role == role && t.resource == resource.modelName
    );

    const find_grant = grants_index != -1 ? this.grants.at(grants_index) : null;

    if (find_grant) {
      var updatedGrant: GrantType = {
        role: role,
        resource: resource.modelName,
        attributes: context.includes("*")
          ? ["*"]
          : Array.from(
              new Set<AttributeList>([...context, ...find_grant.attributes])
            ),
      };

      this.grants = this.grants.map((t, idx) => {
        if (idx === grants_index) return updatedGrant;
        else return t;
      });
    } else {
      var updatedGrant: GrantType = {
        role: role,
        resource: resource.modelName,
        attributes: context.includes("*") ? ["*"] : context,
      };

      this.grants.push(updatedGrant);
    }

    return this;
  }

  /**
   * Deny a user or role to access a resource with provided context.
   * @param role String based role. e.g. `user`
   * @param resource Resource Model to be denied. This is the compiled mongoose model which will be matched with the grants set.
   * @param context list of actions that are denied.
   */
  deny(role: string, resource: Model<any>, context: AttributeList[]) {
    // filter the grants to find the role
    const grants_index = this.grants.findIndex(
      (t) => t.role == role && t.resource == resource.modelName
    );

    const find_grant = grants_index != -1 ? this.grants.at(grants_index) : null;

    if (find_grant) {
      var updatedGrant: GrantType = {
        role: role,
        resource: resource.modelName,
        attributes: context.includes("*")
          ? []
          : find_grant.attributes.filter((t) => !context.includes(t)),
      };

      this.grants = this.grants.map((t, idx) => {
        if (idx === grants_index) return updatedGrant;
        else return t;
      });
    } else {
      var updatedGrant: GrantType = {
        role: role,
        resource: resource.modelName,
        attributes: [],
      };

      this.grants.push(updatedGrant);
    }

    return this;
  }
}
