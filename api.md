#### 1.Language - GET
```
{
  language: [
    {id: 1, lang: 'தமிழ்'},
    {id: 2, lang: 'English'},
  ]
}
```
#### 2.Onboarding - GET
```
{
  next: 'Skip',
  finish: 'Let\'s Go!',
  slides: [
    {id: 1, text: 'Lorem Ipsum', image: 'https://picsum.photos/300/200?grayscale'},
    {id: 2, text: 'Lorem Ipsum', image: 'https://picsum.photos/300/200?grayscale'},
    {id: 3, text: 'Lorem Ipsum', image: 'https://picsum.photos/300/200?grayscale'},
    {id: 4, text: 'Lorem Ipsum', image: 'https://picsum.photos/300/200?grayscale'},
  ]
}
```
#### 3.Register - POST
```
{
  firstName: 'John',
  lastName: 'Doe',
  babyName: 'Nancy',
  babyDOB: '27-08-1992',
  email: 'johndoe@gmail.com',
  password: 'secret',
  phone: '987654321',
  address: 'No: x, xyz street, xyz - 7'
}
```
#### 4.Account Update - POST
```
{
  id: 2,
  image: '', // base64 data
  firstName: 'John',
  lastName: 'Doe',
  babyName: 'Nancy',
  babyDOB: '27-08-1992',
  email: 'johndoe@gmail.com',
  password: 'secret',
  phone: '987654321',
  address: 'No: x, xyz street, xyz - 7'
}
```
#### 5.Login - POST
```
{
  email: 'johndoe@gmail.com',
  password: 'secret',
}
```
#### 6.Dashboard - GET
```
{
  id: 2,
  image: 'https://picsum.photos/100',
  firstName: 'John',
  lastName: 'Doe',
  babyName: 'Nancy',
  email: 'johndoe@gmail.com',
  phone: '987654321',
  upcomingNotifications: [
    {id: 1, title: 'Notification 1', desc: 'Notification 1 Description', image: 'https://picsum.photos/32'},
    {id: 2, title: 'Notification 2', desc: 'Notification 2 Description', image: 'https://picsum.photos/32'},
  ]
}
```
#### 7.Language - GET
```
{
  en: {
    login: 'Login',
    register: 'Register',
    ...
  }, ta: {
    login: 'உள்நுழைய',
    register: 'பதிவு செய்ய',
    ...
  }
}
```
#### 8.Notifications - GET
```
{
  notifications: [
    {id: 1, title: 'Notification 1', desc: 'Notification 1 Description', image: 'https://picsum.photos/32'},
    {id: 2, title: 'Notification 2', desc: 'Notification 2 Description', image: 'https://picsum.photos/32'},
    {id: 3, title: 'Notification 3', desc: 'Notification 3 Description', image: 'https://picsum.photos/32'},
  ]
}
```
#### 9.Questionaires - GET
```
{
  questionaires: [
    {
      id: 1, question: 'What are some good questions to ask?',
      options: [
        {name: 'Yes', value: 'yes'},
        {name: 'No', value: 'no'},
      ], image: 'https://picsum.photos/32',
      optionSelected: 'yes'
    }, {
      id: 2, question: 'What are 10 questions to ask?',
      options: [
        {name: 'Yes', value: 'yes'},
        {name: 'No', value: 'no'},
      ], image: 'https://picsum.photos/32',
      optionSelected: null
    }, {
      id: 3, question: 'What are the 36 questions?',
      options: [
        {name: 'Yes', value: 'yes'},
        {name: 'No', value: 'no'},
      ], image: 'https://picsum.photos/32',
      optionSelected: 'no'
    },
  ], answered: 7, total: 12
}
```
#### 10.Chats Get History - GET
```
{
  chats: [
    { 
      id: 1, message: 'Hi there', type: 'text',
      sender: {
        id: 1, name: 'trust', image: 'https://picsum.photos/100'
      }, receiver: {
        id: 2, name: 'user', image: 'https://picsum.photos/100'
      }, createdOn: '23-09-2020 22:25:50'
    }, { 
      id: 2, message: 'Hey there!', type: 'text',
      sender: {
        id: 2, name: 'user', image: 'https://picsum.photos/100'
      }, receiver: {
        id: 1, name: 'trust', image: 'https://picsum.photos/100'
      }, createdOn: '23-09-2020 22:30:50'
    }, { 
      id: 3, message: 'https://picsum.photos/200', type: 'image',
      sender: {
        id: 1, name: 'trust', image: 'https://picsum.photos/100'
      }, receiver: {
        id: 2, name: 'user', image: 'https://picsum.photos/100'
      }, createdOn: '23-09-2020 22:32:50'
    }, { 
      id: 4, message: 'https://audio.library/sound/tone.mp3', type: 'audio',
      sender: {
        id: 2, name: 'user', image: 'https://picsum.photos/100'
      }, receiver: {
        id: 1, name: 'trust', image: 'https://picsum.photos/100'
      }, createdOn: '23-09-2020 22:30:50'
    }, { 
      id: 5, message: 'https://video.library/video/demo.mp4', type: 'video',
      sender: {
        id: 1, name: 'trust', image: 'https://picsum.photos/100'
      }, receiver: {
        id: 2, name: 'user', image: 'https://picsum.photos/100'
      }, createdOn: '23-09-2020 22:32:50'
    }
  ], isPhycisianEnabled: 1 // true or false
}
```
#### 11.Chats Send Message - POST
```
{
  message: 'Hi there',
  type: 'text',
  senderId: 1,
  receiverId: 2,
  createdOn: '23-09-2020 22:25:50'
}
```
#### 12.Appointments - GET
```
{
  appointments: [
    {id: 1, title: 'Appointment 1', desc: 'Appointment 1 Description', image: 'https://picsum.photos/32', date: '26-09-2020 10:50:40'},
    {id: 2, title: 'Appointment 2', desc: 'Appointment 2 Description', image: 'https://picsum.photos/32', date: '26-09-2020 18:40:44'},
    {id: 3, title: 'Appointment 3', desc: 'Appointment 3 Description', image: 'https://picsum.photos/32', date: '26-09-2020 20:25:37'},
  ]
}
```
#### 13.Settings - GET
```
{
  company: [
    {id: 1, title: 'About Us', image: 'https://picsum.photos/32', url: 'https://satya.school/about-us'},
    {id: 2, title: 'F.A.Q.', image: 'https://picsum.photos/32', url: 'https://satya.school/faq'},
    {id: 3, title: 'Terms & Conditions', image: 'https://picsum.photos/32', url: 'https://satya.school/terms-conditions'},
    {id: 3, title: 'Privacy Policies', image: 'https://picsum.photos/32', url: 'https://satya.school/privacy-policies'},
  ]
}
```