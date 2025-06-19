package com.project.bidcast.mapper;

import com.project.bidcast.vo.ProdDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BidMapper {

    @Select("select * from product where auc_key=#{aucKey}")
    List<ProdDTO> getProdList(int aucKey);
}
