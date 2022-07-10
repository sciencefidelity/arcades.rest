import { compare } from "bcryptjs";
import { User } from "src/models/user-schema";

const Authenticate = async (username: string, password: string) => (
      try {
        // get user by email
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error("authentication failed");
        }
        // match password
        compare(password, user.password, (error, isMatch) => {
          if (error) throw error;
          if (isMatch) {
            resolve(user);
          } else {
            // password didn't match
            reject(new Error("authentication failed"));
          }
        });
      } catch (error) {
        // email not found
        reject(new Error(`authentication failed, ${error}`));
      }
  );

export default Authenticate;
