import { WhereOptions } from "sequelize";
import { FindAndCountAllResult, SequelizePaginationOptions } from "~/types";
import { Customer } from "~/models";
import {
  CustomerAttributes,
  CustomerCreationAttributes,
  CustomerUpdateAttributes,
} from "@app/common";
import { FacadeBase } from "~/facades/FacadeBase";
import { CustomerNotFoundException } from "~/exceptions/CustomerNotFoundException";
import { isEmail } from "@hyulian/common";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";

export class CustomerFacade extends FacadeBase {
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

  async findById(id: string) {
    const result = await Customer.findByPk(id, { paranoid: false });
    if (!result) {
      throw new CustomerNotFoundException({ id });
    }
    return result;
  }

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

  async delete(id: string) {
    const record = await this.findById(id);
    await record.destroy();
  }
}
