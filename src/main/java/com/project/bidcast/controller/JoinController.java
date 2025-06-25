package com.project.bidcast.controller;

import com.project.bidcast.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/fetch")
public class JoinController {


    @Autowired
    private UserService userService;


    @GetMapping("/check-id")
    public Map<String,Boolean> checkId(@RequestParam String id) {
        System.out.println(id);
        boolean isDuplicate = userService.isIdExists(id);

        System.out.println("중복여부:"+isDuplicate);

        Map<String,Boolean> map = new HashMap<>();
        map.put("duplicate",isDuplicate);
        return map;
    }
}
