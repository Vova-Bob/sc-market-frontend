export interface ActiveDelivery {
  location: string
  departure: string
  destination: string
  status: "OK" | "Damaged" | "Low Fuel" | "Under Attack" | "Offline"
  progress: number
  id: number
}

export function makeActiveDeliveries(): ActiveDelivery[] {
  return [
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 30,
      id: 0,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 30,
      id: 1,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 20,
      id: 2,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "OK",
      progress: 20,
      id: 3,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 4,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 5,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 4",
      status: "Damaged",
      progress: 60,
      id: 6,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 7,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 8,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "OK",
      progress: 30,
      id: 9,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Low Fuel",
      progress: 30,
      id: 10,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 11,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Offline",
      progress: 70,
      id: 12,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 13,
    },
    {
      location: "Stanton",
      departure: "Pyro 2",
      destination: "Terra 5",
      status: "Under Attack",
      progress: 70,
      id: 14,
    },
  ]
}
