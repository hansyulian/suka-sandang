import { hashPassword } from '~/utils/hashPassword';
import { verifyPassword } from '~/utils/verifyPassword';

// Mock the modules
jest.mock('~/config/config', () => ({
  appConfig: {
    app: {
      salt: 10, // Mock the salt value
    },
  },
}));

describe('Password: Hash And Verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password using bcrypt with the configured salt and can verify', async () => {
    // Arrange
    const password = 'myPassword123';

    // Act
    const hashedPassword = await hashPassword(password);

    // Assert
    expect(hashedPassword).not.toStrictEqual(password);
    const anotherHash = await hashPassword(password);
    expect(hashedPassword).not.toStrictEqual(anotherHash);
    expect(anotherHash).not.toStrictEqual(password);

    expect(await verifyPassword(password, hashedPassword)).toStrictEqual(true);
    expect(await verifyPassword(password, anotherHash)).toStrictEqual(true);
  });

  it('different password should fail to verify', async () => {
    // Arrange
    const password = 'myPassword123';
    const wrongPassword = 'myPassword1234';
    // Act
    const hashedPassword = await hashPassword(password);

    expect(await verifyPassword(wrongPassword, hashedPassword)).toStrictEqual(
      false,
    );
  });
});
