/**
 * Copyright (C) 2011  JTalks.org Team
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
package org.jtalks.jcommune.web.validation.validators;


import org.jtalks.jcommune.model.entity.JCUser;
import org.jtalks.jcommune.service.UserService;
import org.jtalks.jcommune.service.nontransactional.EncryptionService;
import org.jtalks.jcommune.web.dto.EditUserProfileDto;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintValidatorContext.ConstraintViolationBuilder;
import javax.validation.ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderDefinedContext;

/**
 * 
 * @author Anuar_Nurmakanov
 *
 */
public class ChangedPasswordValidatorTest {
	@Mock
	private UserService userService;
	@Mock
	private EncryptionService encryptionService;
	@Mock
	private ConstraintValidatorContext validatorContext;
	@Mock
	private ConstraintViolationBuilder violationBuilder;
	@Mock 
	private NodeBuilderDefinedContext nodeBuilderDefinedContext;
	private ChangedPasswordValidator validator;
	private String userCurrentPassword = "password";
	private String userNewPassword = "new_password";
	private EditUserProfileDto editUserProfileDto = new EditUserProfileDto();
	
	@BeforeMethod
	public void init() {
		MockitoAnnotations.initMocks(this);
		Mockito.when(userService.getCurrentUser()).thenReturn(
                new JCUser("username", "email", userCurrentPassword));
		validator = new ChangedPasswordValidator(userService, encryptionService);
		//
		editUserProfileDto.setCurrentUserPassword(userCurrentPassword);
		editUserProfileDto.setNewUserPassword(userNewPassword);
	}
	
	@Test
	public void testCheckNullNewPassword() {
		editUserProfileDto.setNewUserPassword(null);
		boolean isValid = validator.isValid(editUserProfileDto, validatorContext);
		Assert.assertEquals(isValid, true, "The null password is not valid.");
	}
	
	@Test
	public void testChangeUserPasswordCorrect() {
	    String currentUserPassword = editUserProfileDto.getCurrentUserPassword();
	    Mockito.when(encryptionService.encryptPassword(currentUserPassword)).
	        thenReturn(currentUserPassword);
		boolean isValid = validator.isValid(editUserProfileDto, validatorContext);
		Assert.assertEquals(isValid, true, "The old password is correct, but the check fails.");
	}
	
	@Test
	public void testChangeUserPasswordIncorrect() {
	    String incorrectCurrentPassword = "other_password";
		editUserProfileDto.setCurrentUserPassword(incorrectCurrentPassword);
		Mockito.when(encryptionService.encryptPassword(incorrectCurrentPassword)).
            thenReturn(incorrectCurrentPassword);
		Mockito.when(validatorContext.buildConstraintViolationWithTemplate(null)).
				thenReturn(violationBuilder);
		Mockito.when(violationBuilder.addNode(Mockito.anyString())).
				thenReturn(nodeBuilderDefinedContext);
		boolean isValid = validator.isValid(editUserProfileDto, validatorContext);
		Assert.assertEquals(isValid, false, "The old password isn't correct, but the check passed.");
		Mockito.verify(validatorContext).buildConstraintViolationWithTemplate(null);
	}
}
