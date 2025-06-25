package com.project.bidcast.mapper;

import com.project.bidcast.vo.ProdDTO;
import com.project.bidcast.vo.TagDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface BidMapper {

    @Select("SELECT p.*,f.file_url FROM product p LEFT JOIN file f on p.prod_key=f.prod_key WHERE p.auc_key=#{aucKey}")
    List<ProdDTO> getProdList(int aucKey);

    @Select("SELECT tag_name FROM tag WHERE tag_key IN (SELECT tag_key FROM auctiontag WHERE auc_key=#{aucKey})")
    List<String> getTagList(int aucKey);

    @Update("UPDATE product SET unit_value=#{unitValue} WHERE prod_key=#{prodKey}")
    int unitUpdate(ProdDTO product);

}
