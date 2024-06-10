import { User } from "@restaurant-reservation/shared";
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";

const router = Router();

const users: User[] = [];

router.get("/", (req: Request, res: Response) => {
  res.json(users);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser: User = { name: req.body.name, password: hashedPassword };
    users.push(newUser);
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const user: User | undefined = users.find(
    (user) => user.name === req.body.name
  );

  if (!user) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("success");
    } else {
      res.send("not allowed");
    }
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

export { router as userRouter };
