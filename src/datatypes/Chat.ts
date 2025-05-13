export interface Chat {
  chat_id: string
  participants: { username: string; avatar: string }[]
  messages: Message[]
  order_id: string | null
}

export interface Message {
  author: string | null
  content: string
  timestamp: number
  chat_id: string
}

// export function makeChats(): Chat[] {
//     return [
//         {
//             chat_id: '0',
//             participants: ['Pumpkintitan', 'Henry'],
//             messages: [
//                 {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                 {author: "Henry", content: "Hello", timestamp: 1640736494},
//             ]
//         },
//         {
//             chat_id: '1',
//             participants: ['Pumpkintitan', 'Bridge4', 'Henry'],
//             messages:
//                 [
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//                     {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                     {author: "Henry", content: "Hello", timestamp: 1640735494},
//                     {
//                         author: "Bridge4", content: `Hello
//                     How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?How are you gamers?
//                     EEEEE`, timestamp: 1640736494
//                     },
//
//                 ]
//         },
//         {
//             chat_id: '2',
//             participants: ['Pumpkintitan', 'Bridge4', 'Henry', 'John', 'Steve'],
//             messages: [
//                 {author: "Pumpkintitan", content: "Hello", timestamp: 1640735494},
//                 {author: "Henry", content: "Hello", timestamp: 1640735494},
//                 {author: "Bridge4", content: "Hello", timestamp: 1640736494}
//             ]
//         },
//     ]
// }
