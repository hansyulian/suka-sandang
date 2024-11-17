import type { WhereOptions } from "sequelize";
import type {
  FindAndCountAllResult,
  SequelizePaginationOptions,
} from "~/types";
import { Supplier } from "~/models/Supplier";
import type {
  SupplierAttributes,
  SupplierCreationAttributes,
  SupplierUpdateAttributes,
} from "@app/common";
import { EngineBase } from "~/engine/EngineBase";
import { SupplierNotFoundException } from "~/exceptions/SupplierNotFoundException";
import { isEmail } from "@hyulian/common";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";
import { WithTransaction } from "~/modules/WithTransactionDecorator";

export class SupplierEngine extends EngineBase {
  @WithTransaction
  async list(
    query: WhereOptions<SupplierAttributes>,
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

  @WithTransaction
  async findById(id: string) {
    const record = await Supplier.findByPk(id, { paranoid: false });
    if (!record) {
      throw new SupplierNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async create(data: SupplierCreationAttributes) {
    const { name, remarks, status, address, email, phone, identity } = data;
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
      identity,
    });
    return Supplier.findByPk(result.id) as unknown as Supplier;
  }

  @WithTransaction
  async update(id: string, data: SupplierUpdateAttributes) {
    const record = await this.findById(id);
    const { name, remarks, status, address, email, phone, identity } = data;
    if (email && !isEmail(email)) {
      throw new InvalidEmailException(email);
    }

    if (status && status !== "deleted") {
      await record.restore({});
    }
    const result = await record.update({
      name,
      remarks,
      status,
      address,
      email,
      phone,
      identity,
    });
    return Supplier.findByPk(result.id, { paranoid: false });
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    await record.destroy();
  }
}
