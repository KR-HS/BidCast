package com.project.bidcast.vo;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class FileDTO {

    private Integer fileKey;
    private String fileUrl;
    private Integer aucKey;
    private Integer prodKey;
    private Integer announceKey;

}
