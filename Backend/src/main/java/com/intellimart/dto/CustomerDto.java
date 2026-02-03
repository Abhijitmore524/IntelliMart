//package com.intellimart.dto;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import com.intellimart.entities.Roles;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.ToString;
//
//import java.util.List;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@ToString
//public class CustomerDto {
//    private Long id;
//    private String name;
//    private String number;
//    private Roles role;
//    private String email;
//
//    // accepted on create, not returned in responses
//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
//    private String password;
//
//    private String gender;
//
////    // optional on create; returned on read with aid populated
////    private List<AddressDto> addresses;
//}
package com.intellimart.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomerDto {

    private Long id;

    private UserDto user;   // <-- nested user object
}
