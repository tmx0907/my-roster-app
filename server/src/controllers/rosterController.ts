import { Request, Response } from "express";

const rosters: any[] = [];

export function uploadRoster(req: Request, res: Response) {
  const roster = {
    id: Date.now().toString(),
    name: req.body.name ?? "New Roster",
    shifts: [],
  };
  rosters.push(roster);
  res.status(201).json(roster);
}

export function getRosters(req: Request, res: Response) {
  res.json(rosters);
}

export function updateRoster(req: Request, res: Response) {
  const { id } = req.params;
  // TODO: 수정 로직 구현
  res.json({ message: `Update roster ${id} stub` });
}

export function deleteRoster(req: Request, res: Response) {
  const { id } = req.params;
  // TODO: 삭제 로직 구현
  res.json({ message: `Delete roster ${id} stub` });
}
