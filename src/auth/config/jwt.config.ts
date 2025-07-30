import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: '3914867ec115657ba9acdc3950c39442a72d55df1293ff23afe9cb115dcda69d',
    signOptions: {
      expiresIn: '7d',
    },
  }),
);
