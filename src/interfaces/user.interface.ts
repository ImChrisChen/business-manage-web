const userInfo = {
	id: 1,
	username: 'admin',
	sex: -1,
	email: null,
	phone: null,
	avatar: null,
	age: -1,
	role_id: 1,
	is_del: 0,
	roles: [
		{
			updated_at: '2022-12-21T15:19:54.498Z',
			created_at: '2022-12-21T15:19:40.000Z',
			id: 1,
			role: 'Developer',
			pid: 0,
		},
	],
	access_token:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2NzE3MTc0MzgsImV4cCI6MTY3MTcyMTAzOH0.ydiy0NHhJZOsda2-2qCvzKX5iP00agBEFCMlHCnTqrw',
};

export type UserInfo = typeof userInfo;
