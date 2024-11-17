import type { WhereOptions } from "sequelize";
import type {
  FindAndCountAllResult,
  SequelizePaginationOptions,
} from "~/types";
import { Customer } from "~/models";
import type {
  CustomerAttributes,
  CustomerCreationAttributes,
  CustomerUpdateAttributes,
} from "@app/common";
import { EngineBase } from "~/engine/EngineBase";
import { CustomerNotFoundException } from "~/exceptions/CustomerNotFoundException";
import { isEmail } from "@hyulian/common";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";
import { WithTransaction } from "~/modules/WithTransactionDecorator";

export class CustomerEngine extends EngineBase {
  @WithTransaction
  async list(
    query: WhereOptions<CustomerAttributes>,
    options: SequelizePaginationOptions
  ): Promise<FindAndCountAllResult<Customer>> {
    const result = await Customer.findAndCountAll({
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
    const record = await Customer.findByPk(id, {
      paranoid: false,
    });
    if (!record) {
      throw new CustomerNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async create(data: CustomerCreationAttributes) {
    const { name, remarks, status, address, email, phone, identity } = data;
    if (email && !isEmail(email)) {
      throw new InvalidEmailException(email);
    }
    const result = await Customer.create({
      name,
      remarks,
      status,
      address,
      email,
      phone,
      identity,
    });
    return Customer.findByPk(result.id) as unknown as Customer;
  }

  @WithTransaction
  async update(id: string, data: CustomerUpdateAttributes) {
    const record = await this.findById(id);
    const { name, remarks, status, address, email, phone, identity } = data;
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
      identity,
    });
    return Customer.findByPk(result.id, { paranoid: false });
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    await record.destroy();
  }
}
