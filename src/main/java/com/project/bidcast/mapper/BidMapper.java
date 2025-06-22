package com.project.bidcast.mapper;

import com.project.bidcast.vo.ProdDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface BidMapper {

    @Select("SELECT * FROM product WHERE auc_key=#{aucKey}")
    List<ProdDTO> getProdList(int aucKey);


    @Update("UPDATE product SET unit_value=#{unitValue} WHERE prod_key=#{prodKey}")
    int unitUpdate(ProdDTO product);
}
