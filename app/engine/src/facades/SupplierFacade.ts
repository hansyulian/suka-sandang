import { WhereOptions } from "sequelize";
import { FindAndCountAllResult, SequelizePaginationOptions } from "~/types";
import { Supplier } from "~/models/Supplier";
import {
  SupplierCreationAttributes,
  SupplierUpdateAttributes,
} from "@app/common";
import { FacadeBase } from "~/facades/FacadeBase";
import { SupplierNotFoundException } from "~/exceptions/SupplierNotFoundException";
import { isEmail } from "@hyulian/common";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";

export class SupplierFacade extends FacadeBase {
  async list(
    query: WhereOptions<Supplier>,
    options: SequelizePaginationOptions
  ): Promise<FindAndCountAllResult<Supplier>> {
    const result = await Supplier.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
    });
    return {
      count: result.count,
      records: result.rows,
    };
  }

  async findById(id: string) {
    const result = await Supplier.findByPk(id, { paranoid: false });
    if (!result) {
      throw new SupplierNotFoundException({ id });
    }
    return result;
  }

  async create(data: SupplierCreationAttributes) {
    const { name, remarks, status, address, email, phone } = data;
    if (email && !isEmail(email)) {
      throw new InvalidEmailException(email);
    }
    const result = await Supplier.create({
      name,
      remarks,
      status,
      address,
      email,
      phone,
    });
    return Supplier.findByPk(result.id) as unknown as Supplier;
  }

  async update(id: string, data: SupplierUpdateAttributes) {
    const record = await this.findById(id);
    const { name, remarks, status, address, email, phone } = data;
    if (status && status !== "deleted") {
      await record.restore({});
    }
    if (email && !isEmail(email)) {
      throw new InvalidEmailException(email);
    }
    const result = await record.update({
      name,
      remarks,
      status,
      address,
      email,
      phone,
    });
    return Supplier.findByPk(result.id, { paranoid: false });
  }

  async delete(id: string) {
    const record = await this.findById(id);
    await record.destroy();
  }
}
