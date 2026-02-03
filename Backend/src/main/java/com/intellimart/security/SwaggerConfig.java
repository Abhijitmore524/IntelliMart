package com.intellimart.security;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

//for Basic Auth
@SecurityScheme(name = "basicAuth", type = SecuritySchemeType.HTTP, scheme = "basic")

//JWT Bearer Token Auth
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")

@OpenAPIDefinition(info = @Info(title = "INTELLIMART", version = "v1.0"), security = {

		@SecurityRequirement(name = "basicAuth") ,
		@SecurityRequirement(name = "bearerAuth")})
@Configuration
public class SwaggerConfig {
}
