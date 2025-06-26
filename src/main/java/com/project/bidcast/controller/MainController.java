package com.project.bidcast.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpSession;

@Controller
public class MainController {

    @GetMapping("/")
    public String redirectToHome() {
        return "redirect:/home.do";
    }

    @GetMapping("/{pageName}.do") //.do 해주세요
    public String page(HttpSession session , @PathVariable String pageName, Model model) {
        model.addAttribute("pageName", pageName);
        System.out.println("뷰이름:" + pageName);

        if(session.getAttribute("id") != null) System.out.println(session.getAttribute("id"));

        return "view"; //언제나 view화면으로 이동합니다.
    }

}
