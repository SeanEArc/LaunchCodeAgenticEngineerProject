package com.example.Final_Project.Final_Project.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

// Plain unit tests: no Spring context and no database connection.
class UsersTest {

	@Test
	void createUserWithAllFields() {
		Users user = new Users(1, "Jane Doe", "janedoe", "secret123", 2000, 150);

		assertEquals(1, user.getId());
		assertEquals("Jane Doe", user.getName());
		assertEquals("janedoe", user.getUsername());
		assertEquals("secret123", user.getPassword());
		assertEquals(2000, user.getCalorieGoal());
		assertEquals(150, user.getProteinGoal());
	}

	@Test
	void createUserWithoutGoalsLeavesGoalsNull() {
		Users user = new Users(2, "John Doe", "johndoe", "secret456");

		assertEquals("johndoe", user.getUsername());
		assertNull(user.getCalorieGoal());
		assertNull(user.getProteinGoal());
	}

	@Test
	void createUserWithSetters() {
		Users user = new Users();
		user.setName("Sam Smith");
		user.setUsername("samsmith");
		user.setPassword("secret789");
		user.setCalorieGoal(1800);
		user.setProteinGoal(120);

		assertEquals("Sam Smith", user.getName());
		assertEquals("samsmith", user.getUsername());
		assertEquals("secret789", user.getPassword());
		assertEquals(1800, user.getCalorieGoal());
		assertEquals(120, user.getProteinGoal());
	}
}
