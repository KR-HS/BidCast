package com.project.bidcast.util;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.folder}")
    private String folder;

    @Value("${aws.s3.region}")
    private String region;  // 추가

    public String upload(MultipartFile file) {
        try {
            String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(file.getContentType())
//                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(request, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

            // 직접 region 필드를 사용
            return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("S3 파일 업로드 실패", e);
        }
    }
}

